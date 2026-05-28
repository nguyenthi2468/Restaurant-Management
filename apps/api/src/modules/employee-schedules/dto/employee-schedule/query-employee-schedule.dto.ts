import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsDate,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { ScheduleStatus } from '@prisma/client';

export class QueryEmployeeScheduleDto {
  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  shiftId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
