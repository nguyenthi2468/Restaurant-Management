import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { PrismaModule } from '../prisma/prisma.module'; // thêm nếu TableService dùng PrismaService

@Module({
  imports: [PrismaModule], // thêm nếu TableService inject PrismaService
  controllers: [TableController],
  providers: [TableService],
  exports: [TableService], // ← thiếu dòng này
})
export class TableModule {}
