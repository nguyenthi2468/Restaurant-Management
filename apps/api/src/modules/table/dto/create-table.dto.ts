import {
  IsString,
  IsInt,
  IsEnum,
  IsOptional,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TableStatus } from '@prisma/client';

export class CreateTableDto {
  @ApiProperty({
    description: 'Tên bàn (unique)',
    example: 'Bàn 01',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Tầng/khu vực vật lý (ví dụ: Tầng 1, Tầng 2)',
    example: 'Tầng 1',
  })
  @IsString()
  @IsNotEmpty()
  floor!: string;

  // Removed area field as TableArea is no longer exported from @prisma/client

  @ApiProperty({
    description: 'Số ghế (sức chứa) của bàn',
    example: 4,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacity!: number; // Renamed from seats to capacity

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
