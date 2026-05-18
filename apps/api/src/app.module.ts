import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { ActionsModule } from './modules/actions/actions.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ImageModule } from './modules/image/image.module';
import { MenuModule } from './modules/menu/menu.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TableModule } from './modules/table/table.module';
import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    MailModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    ActionsModule,
    CloudinaryModule,
    ImageModule,
    MenuModule,
    TableModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
