import { IsInt, Min, IsOptional } from 'class-validator';
import { TableStatus } from '@prisma/client';
import {
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class UpdateTableDto {
  @ApiPropertyOptional({
    description: 'Sức chứa tối đa của bàn',
    example: 6,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái bàn',
    example: 'OCCUPIED',
    enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE'],
  })
  @IsOptional()
  status?: TableStatus;
}