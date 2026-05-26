import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class FindAllOrdersDto {
  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái đơn hàng',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo tên người tạo đơn hàng',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Ngày bắt đầu (ISO 8601 format)',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Ngày kết thúc (ISO 8601 format)',
    example: '2026-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi trên mỗi trang',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
