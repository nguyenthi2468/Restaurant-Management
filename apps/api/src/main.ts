import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let cachedApp: any = null;

async function createApp() {
  if (cachedApp) return cachedApp;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');

  // Cấu hình Swagger cho tài liệu API
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Restaurant Management API')
      .setDescription('API để quản lý hoạt động của nhà hàng')
      .setVersion('1.0')
      .addTag('menu', 'Quản lý menu')
      .addTag('auth', 'Xác thực và quản lý phiên')
      .addTag('users', 'Quản lý người dùng')
      .addTag('roles', 'Quản lý vai trò và quyền')
      .addTag('permissions', 'Quản lý quyền truy cập')
      .addTag('actions', 'Quản lý hành động hệ thống')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.init();

  cachedApp = app.getHttpAdapter().getInstance();
  return cachedApp;
}

const handler = async (req: any, res: any) => {
  const app = await createApp();
  return app(req, res);
};

// ✅ Tự động start server khi chạy dev (Node environment)
if (process.env.NODE_ENV !== 'production') {
  createApp().then((app) => {
    const port = process.env.PORT ?? 3000;
    app.listen(port, () =>
      console.log(`🚀 Dev server running on http://localhost:${port}`),
    );
  });
}

// Export default cho Vercel
export default handler;
