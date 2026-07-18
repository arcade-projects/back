import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:3000',
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
  
  await app.listen(process.env.PORT ?? 9090, '0.0.0.0');
}
bootstrap();
