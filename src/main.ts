import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function enforceRequiredEnvVars(vars: string[]) {
  const missing = vars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(
        ', ',
      )}. Please set them in your environment.`,
    );
  }
}

async function bootstrap() {
  enforceRequiredEnvVars([
    'VERCEL_WEBHOOK_SECRET',
    'VERCEL_LINKED_PROJECT',
    'RR_EDGE_CONFIG',
    'VERCEL_API_TOKEN',
    'VERCEL_TEAM_ID',
  ]);

  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors({ origin: true });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
