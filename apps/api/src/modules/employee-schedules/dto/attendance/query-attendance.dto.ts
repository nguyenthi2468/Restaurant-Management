import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDate, IsEnum } from 'class-validator';
import { AttendanceStatus } from '@prisma/client';

export class QueryAttendanceDto {
  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;
}
