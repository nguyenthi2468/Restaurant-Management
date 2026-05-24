import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TableArea, TableStatus } from '@prisma/client';

export class CreateTableDto {
  @ApiProperty({
    description: 'Tên bàn (unique)',
    example: 'Bàn 01',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ID của tầng',
    example: 'clxxx123456789',
  })
  @IsString()
  @IsNotEmpty()
  floorId: string;

  @ApiPropertyOptional({
    description: 'Khu vực bàn',
    enum: TableArea,
    example: TableArea.NORMAL,
    default: TableArea.NORMAL,
  })
  @IsEnum(TableArea)
  @IsOptional()
  area?: TableArea;

  @ApiProperty({
    description: 'Số ghế (sức chứa) của bàn',
    example: 4,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  seats: number;

  @ApiPropertyOptional({
    description: 'Trạng thái bàn ban đầu',
    enum: TableStatus,
    example: TableStatus.AVAILABLE,
    default: TableStatus.AVAILABLE,
  })
  @IsEnum(TableStatus)
  @IsOptional()
  status?: TableStatus;
}
