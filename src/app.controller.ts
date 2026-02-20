import { Controller, Get, Header, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { AppService } from './app.service';

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
    return this.appService.handleWebhook(
      req.rawBody!,
      req.headers['x-vercel-signature'] as string | undefined,
      req.method,
      req.path,
      req.body,
    );
  }
}
