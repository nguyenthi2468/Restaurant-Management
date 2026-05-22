import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID món ăn',
    example: 'menuitem_123abc',
  })
  @IsString()
  menuItemId: string;

  @ApiProperty({
    description: 'Số lượng món ăn',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Đơn giá của món ăn (tiền tệ)',
    example: 150000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID bàn đã đặt',
    example: 'table_456def',
  })
  @IsString()
  tableId: string;

  @ApiProperty({
    description: 'Tổng tiền đơn hàng (tiền tệ)',
    example: 300000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({
    description: 'Danh sách món ăn trong đơn hàng',
    example: [
      {
        menuItemId: 'menuitem_123abc',
        quantity: 2,
        price: 150000,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
