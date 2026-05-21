import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TableModule } from '../table/table.module';
import { VnpayService } from './vnpay.service'; // Import VnpayService

@Module({
  imports: [PrismaModule, TableModule, ConfigModule], // Add ConfigModule
  controllers: [BookingController],
  providers: [BookingService, VnpayService], // Add VnpayService
  exports: [BookingService],
})
export class BookingModule {}
