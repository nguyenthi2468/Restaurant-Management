import { Type } from 'class-transformer';
import { IsString, IsDate, IsOptional, IsEnum } from 'class-validator';
import { ScheduleStatus } from '@prisma/client';

export class CreateEmployeeScheduleDto {
  @IsString()
  employeeId!: string;

  @IsString()
  shiftId!: string;

  @IsDate()
  @Type(() => Date)
  date!: Date;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
