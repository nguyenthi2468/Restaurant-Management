import { Type } from 'class-transformer';
import { IsString, IsDate, IsOptional, IsEnum } from 'class-validator';
import { TimeOffType } from '@prisma/client';

export class CreateTimeOffRequestDto {
  @IsString()
  employeeId!: string;

  @IsEnum(TimeOffType)
  type!: TimeOffType;

  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @IsOptional()
  @IsString()
  reason?: string;
}
