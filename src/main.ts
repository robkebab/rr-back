import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  if (!process.env.VERCEL_WEBHOOK_SECRET) {
    throw new Error(
      'VERCEL_WEBHOOK_SECRET environment variable must be set. ' +
        'Get it from the Vercel Dashboard when creating your webhook.',
    );
  }

  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors({ origin: true });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
