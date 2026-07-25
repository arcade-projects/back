import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const allowedOrigins = [
    process.env.ORIGIN_PROD,
    process.env.ORIGIN_PROD_WWW,
    process.env.ORIGIN_STAGE,
    process.env.ORIGIN_DEV,
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
