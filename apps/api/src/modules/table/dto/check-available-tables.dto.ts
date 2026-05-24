import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CheckAvailableTablesDto {
  @ApiProperty({
    description: 'Thời gian bắt đầu đặt bàn',
    example: '2026-05-22T18:00:00.000Z',
  })
  @IsDateString()
  bookingTime: string;

  @ApiProperty({
    description: 'ID của tầng',
    example: 'clxxx123456789',
  })
  @IsString()
  @IsNotEmpty()
  floorId: string;
  @ApiProperty({
    description:
      'Thời gian kết thúc đặt bàn (tùy chọn, sẽ tự động tính nếu không cung cấp)',
    example: '2026-05-22T20:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endTime?: string;
}
