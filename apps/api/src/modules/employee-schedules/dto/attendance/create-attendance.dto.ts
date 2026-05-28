import { Type } from 'class-transformer';
import { IsString, IsDate, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class CreateAttendanceDto {
  @IsString()
  employeeId!: string;

  @IsDate()
  @Type(() => Date)
  date!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  clockIn?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  clockOut?: Date;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsNumber()
  workHours?: number;

  @IsOptional()
  @IsNumber()
  overtimeHours?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
