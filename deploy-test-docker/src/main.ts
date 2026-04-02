import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const config = app.get(ConfigService);
  const corsOrigins = config
    .getOrThrow<string>('CORS_ORIGINS')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.use(cookieParser());
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  if (config.get<boolean>('SWAGGER_ENABLED', true)) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Guia Comercial API')
      .setDescription('API do SaaS Guia Comercial')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      )
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  const port = config.get<number>('PORT') ?? 3001;
  await app.listen(port);
}

void bootstrap();
