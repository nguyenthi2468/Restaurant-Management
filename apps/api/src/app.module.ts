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
import { FloorModule } from './modules/floor/floor.module';
import { TableModule } from './modules/table/table.module';
import { OrderModule } from './modules/order/order.module';
import { OrderItemModule } from './modules/order-item/order-item.module';
import { BookingModule } from './modules/booking/booking.module';
import { PusherModule } from './modules/pusher/pusher.module';
import { KitchenModule } from './modules/kitchen/kitchen.module';
import { EmployeeSchedulesModule } from './modules/employee-schedules/employee-schedules.module';
import { AiModule } from './modules/ai/ai.module';
import { ContactModule } from './modules/contact/contact.module';
import { NewsModule } from './modules/news/news.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 20,
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
    FloorModule,
    TableModule,
    OrderModule,
    OrderItemModule,
    BookingModule,
    PusherModule,
    KitchenModule,
    EmployeeSchedulesModule,
    AiModule,
    ContactModule,
    NewsModule
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
