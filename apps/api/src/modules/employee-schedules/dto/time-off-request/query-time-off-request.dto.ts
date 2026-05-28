import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDate, IsEnum } from 'class-validator';
import { TimeOffRequestStatus, TimeOffType } from '@prisma/client';

export class QueryTimeOffRequestDto {
  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsEnum(TimeOffType)
  type?: TimeOffType;

  @IsOptional()
  @IsEnum(TimeOffRequestStatus)
  status?: TimeOffRequestStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
