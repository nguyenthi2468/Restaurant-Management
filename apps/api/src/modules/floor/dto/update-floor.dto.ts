import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFloorDto {
  @ApiPropertyOptional({
    description: 'Tên tầng (unique)',
    example: 'Tầng 2',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
