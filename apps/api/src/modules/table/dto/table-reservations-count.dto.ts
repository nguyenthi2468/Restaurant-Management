import { ApiProperty } from '@nestjs/swagger';

export class TableReservationCountDto {
  @ApiProperty({
    description: 'ID của bàn',
    example: 'table-uuid-123',
  })
  tableId: string;

  @ApiProperty({
    description: 'Số lượng đặt bàn trong ngày',
    example: 3,
  })
  count: number;
}

export class ReservationsByDateResponseDto {
  @ApiProperty({
    description: 'Danh sách bàn và số lượng đặt bàn',
    type: [TableReservationCountDto],
  })
  data: TableReservationCountDto[];
}
