import { IsInt, Min } from 'class-validator';
import {
  ApiProperty,
} from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty({
    description: 'Số bàn (unique identifier)',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  number: number;

  @ApiProperty({
    description: 'Sức chứa tối đa của bàn',
    example: 4,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacity: number;
}