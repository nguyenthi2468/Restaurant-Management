import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID của đơn hàng mà mục này thuộc về',
    example: 'order_123abc',
  })
  @IsString()
  orderId!: string;

  @ApiProperty({
    description: 'ID của món ăn trong mục đơn hàng này',
    example: 'menuitem_456def',
  })
  @IsString()
  menuItemId!: string;

  @ApiProperty({
    description: 'Số lượng món ăn được đặt',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({
    description: 'Đơn giá của món ăn (tiền tệ, đơn vị: VND)',
    example: 150000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price!: number;
}
