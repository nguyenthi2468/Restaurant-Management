import { IsString, IsInt, IsEnum, IsOptional, Min, IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TableArea, TableStatus } from '@prisma/client';

export class UpdateTableDto {
  @ApiPropertyOptional({
    description: 'Tên bàn (unique)',
    example: 'Bàn 01',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Tầng/khu vực vật lý (ví dụ: Tầng 1, Tầng 2)',
    example: 'Tầng 1',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  floor?: string;

  @ApiPropertyOptional({
    description: 'Khu vực bàn',
    enum: TableArea,
    example: TableArea.NORMAL,
  })
  @IsEnum(TableArea)
  @IsOptional()
  area?: TableArea;

  @ApiPropertyOptional({
    description: 'Số ghế (sức chứa) của bàn',
    example: 6,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  seats?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái bàn',
    enum: TableStatus,
    example: TableStatus.OCCUPIED,
  })
  @IsEnum(TableStatus)
  @IsOptional()
  status?: TableStatus;
}