import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { Vercel } from '@vercel/sdk';
import { createHmac, timingSafeEqual } from 'crypto';

interface RollingReleaseWebhook {
  id: string;
  type: string;
  createdAt: number;
  payload: {
    projectId: string;
    projectName: string;
    rollingRelease: {
      state: string;
      activeStageIndex: number;
      default: {
        baseDeploymentId: string;
        targetDeploymentId: string;
        targetPercentage?: number;
        targetStartAt: number;
        targetUpdatedAt: number;
      };
    };
  };
}

const EVENT_TYPES = {
  STARTED: 'project.rolling-release.started',
  APPROVED: 'project.rolling-release.approved',
  COMPLETED: 'project.rolling-release.completed',
  ABORTED: 'project.rolling-release.aborted',
} as const;

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private readonly vercel = new Vercel({
    bearerToken: process.env.VERCEL_API_TOKEN!,
  });

  async handleWebhook(
    rawBody: Buffer,
    signature: string | undefined,
    body: unknown,
  ): Promise<{ received: boolean }> {
    this.verifySignature(
      rawBody,
      signature,
      process.env.VERCEL_WEBHOOK_SECRET!,
    );

    const event = body as RollingReleaseWebhook;

    if (event.payload?.projectId !== process.env.VERCEL_LINKED_PROJECT) {
      this.logger.log(
        `Ignoring webhook for project ${event.payload?.projectId} (expected ${process.env.VERCEL_LINKED_PROJECT})`,
      );
      return { received: true };
    }

    this.logger.log(`Received ${event.type} for ${event.payload.projectName}`);

    switch (event.type) {
      case EVENT_TYPES.STARTED:
        await this.onRollingReleaseStarted(event);
        break;
      case EVENT_TYPES.APPROVED:
        await this.onRollingReleaseApproved(event);
        break;
      case EVENT_TYPES.COMPLETED:
        await this.onRollingReleaseCompleted(event);
        break;
      case EVENT_TYPES.ABORTED:
        await this.onRollingReleaseAborted(event);
        break;
      default:
        this.logger.warn(`Unknown event type: ${event.type}`);
    }

    return { received: true };
  }

  private async onRollingReleaseStarted(
    event: RollingReleaseWebhook,
  ): Promise<void> {
    const { targetPercentage, targetDeploymentId } =
      event.payload.rollingRelease.default;

    this.logger.log(
      `Rolling release started: ${targetDeploymentId} at ${targetPercentage}%`,
    );

    await this.updateEdgeConfig([
      {
        operation: 'upsert',
        key: 'targetPercentage',
        value: (targetPercentage ?? 0) / 100,
      },
      {
        operation: 'upsert',
        key: 'targetDeploymentId',
        value: targetDeploymentId,
      },
    ]);
  }

  private async onRollingReleaseApproved(
    event: RollingReleaseWebhook,
  ): Promise<void> {
    const { targetPercentage, targetDeploymentId } =
      event.payload.rollingRelease.default;

    const storedDeploymentId = (await this.readEdgeConfigItem(
      'targetDeploymentId',
    )) as string | undefined;

    if (storedDeploymentId !== targetDeploymentId) {
      this.logger.warn(
        `Deployment ID mismatch: edge config has "${storedDeploymentId ?? '(none)'}" but webhook has "${targetDeploymentId}" — skipping`,
      );
      return;
    }

    this.logger.log(
      `Rolling release approved: ${targetDeploymentId} advancing to ${targetPercentage}%`,
    );

    await this.updateEdgeConfig([
      {
        operation: 'upsert',
        key: 'targetPercentage',
        value: (targetPercentage ?? 0) / 100,
      },
    ]);
  }

  private async onRollingReleaseCompleted(
    event: RollingReleaseWebhook,
  ): Promise<void> {
    const teamId = process.env.VERCEL_TEAM_ID;

    this.logger.log(
      `Rolling release completed for ${event.payload.projectName}, completing rr-back rolling release`,
    );

    const { rollingRelease } =
      await this.vercel.rollingRelease.getRollingRelease({
        idOrName: 'rr-back',
        teamId,
        state: 'ACTIVE',
      });

    const canaryDeploymentId = rollingRelease?.canaryDeployment?.id;
    if (!canaryDeploymentId) {
      this.logger.warn(
        'No active rolling release found for rr-back — skipping',
      );
      return;
    }

    await this.vercel.rollingRelease.completeRollingRelease({
      idOrName: 'rr-back',
      teamId,
      requestBody: { canaryDeploymentId },
    });

    this.logger.log(
      `Completed rr-back rolling release (canary: ${canaryDeploymentId})`,
    );
  }

  private async onRollingReleaseAborted(
    event: RollingReleaseWebhook,
  ): Promise<void> {
    const teamId = process.env.VERCEL_TEAM_ID;

    this.logger.log(
      `Rolling release aborted for ${event.payload.projectName}, aborting rr-back rolling release`,
    );

    const { rollingRelease } =
      await this.vercel.rollingRelease.getRollingRelease({
        idOrName: 'rr-back',
        teamId,
        state: 'ACTIVE',
      });

    const canaryDeploymentId = rollingRelease?.canaryDeployment?.id;
    if (!canaryDeploymentId) {
      this.logger.warn(
        'No active rolling release found for rr-back — skipping',
      );
      return;
    }

    await this.abortRollingRelease('rr-back', canaryDeploymentId);

    this.logger.log(
      `Aborted rr-back rolling release (canary: ${canaryDeploymentId})`,
    );
  }

  private async abortRollingRelease(
    idOrName: string,
    canaryDeploymentId: string,
  ): Promise<void> {
    const teamId = process.env.VERCEL_TEAM_ID;
    const url = new URL(
      `https://api.vercel.com/v1/projects/${idOrName}/rolling-release/abort`,
    );
    if (teamId) {
      url.searchParams.set('teamId', teamId);
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ canaryDeploymentId }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Rolling release abort failed (${response.status}): ${errorBody}`,
      );
    }
  }

  private async readEdgeConfigItem(key: string): Promise<unknown> {
    const result = await this.vercel.edgeConfig.getEdgeConfigItem({
      edgeConfigId: process.env.RR_EDGE_CONFIG!,
      edgeConfigItemKey: key,
      teamId: process.env.VERCEL_TEAM_ID,
    });
    return result.value;
  }

  private async updateEdgeConfig(
    items: { operation: 'upsert'; key: string; value: unknown }[],
  ): Promise<void> {
    await this.vercel.edgeConfig.patchEdgeConfigItems({
      edgeConfigId: process.env.RR_EDGE_CONFIG!,
      teamId: process.env.VERCEL_TEAM_ID,
      requestBody: { items },
    });
    this.logger.log(
      `Edge Config updated: ${items.map((i) => i.key).join(', ')}`,
    );
  }

  private verifySignature(
    rawBody: Buffer,
    signature: string | undefined,
    secret: string,
  ): void {
    if (!signature) {
      throw new ForbiddenException('Missing x-vercel-signature header');
    }

    const expected = createHmac('sha1', secret).update(rawBody).digest('hex');

    const expectedBuf = Buffer.from(expected, 'utf-8');
    const signatureBuf = Buffer.from(signature, 'utf-8');

    if (
      expectedBuf.length !== signatureBuf.length ||
      !timingSafeEqual(expectedBuf, signatureBuf)
    ) {
      throw new ForbiddenException('Invalid webhook signature');
    }
  }
  getHello(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NestJS on Vercel</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background: linear-gradient(135deg, #000 0%, #111 100%);
          color: #fff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          text-align: center;
          max-width: 600px;
          padding: 2rem;
        }
        .logo {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.5rem;
        }
        h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }
        p {
          font-size: 1.125rem;
          color: #888;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        .feature {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          backdrop-filter: blur(10px);
        }
        .feature h3 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .feature a {
          font-size: 1rem;
          color: white;
          margin: 0;
          text-decoration: none;
        }
        .feature a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="https://api-frameworks.vercel.sh/framework-logos/nestjs.svg" alt="Nitro logo" class="logo" />
        <h1>Welcome to NestJS</h1>
        <p>A progressive Node.js framework running on Vercel</p>
        <div class="features">
          <div class="feature">
            <a href="https://vercel.com/docs/frameworks/nestjs" target="_blank" rel="noreferrer">Vercel docs</a>
          </div>
          <div class="feature">
            <a href="https://docs.nestjs.com" target="_blank" rel="noreferrer">NestJS docs</a>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}
