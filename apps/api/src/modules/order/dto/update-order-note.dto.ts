import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderNoteDto {
  @ApiProperty({
    description: 'Ghi chú cho đơn hàng',
    example: 'Không hành',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}
