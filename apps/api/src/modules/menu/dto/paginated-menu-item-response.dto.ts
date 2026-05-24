import { ApiProperty } from '@nestjs/swagger';
import { MenuItemDto } from './menu-item.dto';

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

export class PaginatedMenuItemResponseDto {
  @ApiProperty({ description: 'List of menu items', type: [MenuItemDto] })
  data: MenuItemDto[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMeta })
  meta: PaginationMeta;
}
