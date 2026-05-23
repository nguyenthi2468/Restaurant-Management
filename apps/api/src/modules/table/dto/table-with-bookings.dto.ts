import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID, IsString } from 'class-validator';
import { TableDto } from './table.dto';

export class BookingInfoDto {
  @ApiProperty({ description: 'The unique identifier of the booking' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Booking start time' })
  @IsDateString()
  bookingTime: Date;

  @ApiProperty({ description: 'Booking end time' })
  @IsDateString()
  endTime: Date;

  @ApiProperty({ description: 'Customer name' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Customer phone' })
  @IsString()
  customerPhone: string;
}

export class TableWithBookingsDto extends TableDto {
  @ApiProperty({
    description: 'List of bookings for this table',
    type: [BookingInfoDto],
  })
  bookings: BookingInfoDto[];
}

export class PaginatedTableWithBookingsResponseDto {
  @ApiProperty({
    description: 'Array of tables with their bookings',
    type: [TableWithBookingsDto],
  })
  data: TableWithBookingsDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
