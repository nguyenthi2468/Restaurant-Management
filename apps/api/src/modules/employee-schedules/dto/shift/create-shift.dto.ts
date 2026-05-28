import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateShiftDto {
  @IsString()
  name!: string;

  @IsString()
  type!: string;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
