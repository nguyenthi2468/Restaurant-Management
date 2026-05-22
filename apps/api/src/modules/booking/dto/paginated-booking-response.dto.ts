import { ApiProperty } from '@nestjs/swagger';
import { BookingDto } from './booking.dto';

export class PaginationMeta {
  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of items' })
  total: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}

export class PaginatedBookingResponseDto {
  @ApiProperty({ description: 'List of bookings', type: [BookingDto] })
  data: BookingDto[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMeta })
  meta: PaginationMeta;
}
