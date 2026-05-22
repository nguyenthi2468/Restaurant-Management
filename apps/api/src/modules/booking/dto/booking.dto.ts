import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { BookingStatus, DepositStatus } from '@prisma/client';
import { BookingTableDto } from './booking-table.dto';
import { BookingMenuItemDto } from './booking-menu-item.dto';

export class BookingDto {
  @ApiProperty({ description: 'The unique identifier of the booking' })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The ID of the customer who made the booking',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ description: 'The name of the customer' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'The phone number of the customer' })
  @IsString()
  customerPhone: string;

  @ApiProperty({ description: 'The scheduled booking time (ISO 8601 format)' })
  @IsDateString()
  bookingTime: Date;

  @ApiProperty({
    description: 'The estimated end time of the booking (ISO 8601 format)',
  })
  @IsDateString()
  endTime: Date;

  @ApiProperty({ description: 'The number of adult guests' })
  @IsInt()
  @Min(1)
  numberOfGuests: number;

  @ApiProperty({ description: 'The number of children guests', default: 0 })
  @IsInt()
  @Min(0)
  numberOfChildren: number;

  @ApiProperty({
    description: 'Additional notes for the booking',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'The deposit amount required for the booking',
    type: Number,
  })
  depositAmount: number;

  @ApiProperty({
    description: 'The status of the deposit',
    enum: DepositStatus,
    default: DepositStatus.PENDING,
  })
  @IsEnum(DepositStatus)
  depositStatus: DepositStatus;

  @ApiProperty({
    description: 'The current status of the booking',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @ApiProperty({ description: 'The creation timestamp of the booking' })
  createdAt: Date;

  @ApiProperty({ description: 'The last update timestamp of the booking' })
  updatedAt: Date;

  @ApiProperty({
    type: [BookingTableDto],
    description: 'List of tables associated with this booking',
  })
  bookingTables: BookingTableDto[];

  @ApiProperty({
    type: [BookingMenuItemDto],
    description: 'List of pre-ordered menu items for this booking',
  })
  preOrderItems: BookingMenuItemDto[];
}
