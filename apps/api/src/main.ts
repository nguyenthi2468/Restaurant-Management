import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import type { AppConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const { port, apiPrefix, corsOrigins } =
    configService.get<AppConfig>('app')!;

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.setGlobalPrefix(apiPrefix);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Savore - Restaurant Management API')
    .setDescription('API documentation for Savore restaurant management system')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  await app.listen(port);
}
bootstrap();
