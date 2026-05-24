import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order-item.dto';
import { IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
  @ApiPropertyOptional({
    description: 'ID của đơn hàng mà mục này thuộc về',
    example: 'order_123abc',
  })
  orderId?: string;

  @ApiPropertyOptional({
    description: 'ID của món ăn trong mục đơn hàng này',
    example: 'menuitem_456def',
  })
  menuItemId?: string;

  @ApiPropertyOptional({
    description: 'Số lượng món ăn được đặt',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({
    description: 'Ghi chú hoặc chú thích về món ăn',
    example: 'Với thêm',
  })
  note?: string;

  @ApiPropertyOptional({
    description: 'Đơn giá của món ăn (tiền tệ, đơn vị: VND)',
    example: 150000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price?: number;
}
