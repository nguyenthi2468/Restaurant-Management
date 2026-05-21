import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFloorDto {
  @ApiProperty({
    description: 'Tên tầng (unique)',
    example: 'Tầng 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
