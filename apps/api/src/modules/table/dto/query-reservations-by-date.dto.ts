import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class QueryReservationsByDateDto {
  @ApiProperty({
    description: 'Ngày cần tra cứu theo định dạng dd/mm/yyyy',
    example: '29/06/2026',
  })
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'Ngày phải theo định dạng dd/mm/yyyy',
  })
  date: string;
}
