import {
  Controller,
  ForbiddenException,
  Get,
  Header,
  Post,
  Req,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import type { Request } from 'express';
import { AppService } from './app.service';

function verifyWebhook(
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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  getHealth(): string {
    console.log('Health check');
    return 'OK';
  }

  @Get('/version')
  getVersion(): string {
    console.log('Version check');
    return '1.0.0';
  }

  @Post('/webhook')
  handleWebhook(@Req() req: RawBodyRequest<Request>): { received: boolean } {
    verifyWebhook(
      req.rawBody!,
      req.headers['x-vercel-signature'] as string | undefined,
      process.env.VERCEL_WEBHOOK_SECRET!,
    );

    const timestamp = new Date().toISOString();
    const headers: Record<string, string | string[] | undefined> = {
      ...req.headers,
    };
    const body: unknown = req.body ?? '(empty)';

    const logLines = [
      '--- Rolling release webhook ---',
      `Time: ${timestamp}`,
      `Method: ${req.method}`,
      `Path: ${req.path}`,
      'Headers:',
      Object.entries(headers)
        .map(([k, v]) => `  ${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join('\n'),
      'Body:',
      typeof body === 'object' && body !== null
        ? JSON.stringify(body, null, 2)
        : String(body),
      '---',
    ];
    console.log(logLines.join('\n'));

    return { received: true };
  }
}
