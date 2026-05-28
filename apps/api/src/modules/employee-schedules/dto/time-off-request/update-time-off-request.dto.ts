import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TimeOffRequestStatus } from '@prisma/client';

export class UpdateTimeOffRequestDto {
  @IsOptional()
  @IsEnum(TimeOffRequestStatus)
  status?: TimeOffRequestStatus;

  @IsOptional()
  @IsString()
  reviewNote?: string;
}
