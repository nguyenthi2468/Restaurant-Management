import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiPropertyOptional({
    description: 'Ghi chú hoặc chú thích về món ăn',
    example: 'Với thêm',
  })
  @IsString()
  note?: string;
}
