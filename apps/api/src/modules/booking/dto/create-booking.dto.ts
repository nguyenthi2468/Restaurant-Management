import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BookingStatus, DepositStatus } from '@prisma/client';
import { CreateBookingTableDto } from './create-booking-table.dto';
import { CreateBookingMenuItemDto } from './create-booking-menu-item.dto';

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsString()
  customerName!: string;

  @IsString()
  customerPhone!: string;

  @IsString()
  customerEmail!: string;

  @IsDate()
  @Type(() => Date)
  bookingTime!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endTime?: Date;

  @IsInt()
  numberOfGuests!: number;

  @IsInt()
  @IsOptional()
  numberOfChildren?: number;

  @IsString()
  @IsOptional()
  note?: string;

  @IsNumber({ maxDecimalPlaces: 3 })
  @IsOptional()
  depositAmount?: number;

  @IsOptional()
  depositStatus?: DepositStatus;

  @IsOptional()
  status?: BookingStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingTableDto)
  tables!: CreateBookingTableDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBookingMenuItemDto)
  @IsOptional()
  preOrderItems?: CreateBookingMenuItemDto[];
}
