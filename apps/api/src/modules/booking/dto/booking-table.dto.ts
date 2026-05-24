import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class BookingTableDto {
  @ApiProperty({
    description: 'The unique identifier of the booking table entry',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'The ID of the booking this table belongs to' })
  @IsUUID()
  bookingId: string;

  @ApiProperty({ description: 'The ID of the table' })
  @IsUUID()
  tableId: string;

  @ApiProperty({
    description: 'The creation timestamp of the booking table entry',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update timestamp of the booking table entry',
  })
  updatedAt: Date;
}
