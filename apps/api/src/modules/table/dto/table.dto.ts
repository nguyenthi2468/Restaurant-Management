import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { TableArea, TableStatus } from '@prisma/client';

export class FloorDto {
  @ApiProperty({ description: 'The unique identifier of the floor' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The name of the floor' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Creation timestamp of the floor' })
  @IsDateString()
  createdAt: Date;
}
export class TableDto {
  @ApiProperty({ description: 'The unique identifier of the table' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The name of the table (unique)' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The floor this table belongs to' })
  floor: FloorDto;

  @ApiProperty({
    description: 'The area of the table',
    enum: TableArea,
    default: TableArea.NORMAL,
  })
  @IsEnum(TableArea)
  area: TableArea;

  @ApiProperty({ description: 'Number of seats at the table' })
  @IsInt()
  @Min(1)
  seats: number;

  @ApiProperty({
    description: 'Current status of the table',
    enum: TableStatus,
    default: TableStatus.AVAILABLE,
  })
  @IsEnum(TableStatus)
  status: TableStatus;

  @ApiProperty({ description: 'Creation timestamp of the table' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp of the table' })
  @IsDateString()
  updatedAt: Date;
}
