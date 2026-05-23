import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'ID khách hàng',
    example: 'customer_123abc',
  })
  @IsString()
  customerId: string;

  @ApiProperty({
    description: 'Danh sách ID bàn cho đơn hàng (có thể nhiều bàn)',
    example: ['table_456def', 'table_789ghi'],
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tableIds?: string[];

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
  @IsOptional()
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];

  @ApiProperty({
    description: 'Ghi chú cho đơn hàng',
    example: 'Không hành',
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'Tên khách hàng',
    example: 'Nguyễn Văn A',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({
    description: 'Số điện thoại khách hàng',
    example: '0901234567',
    required: false,
  })
  @IsString()
  @IsOptional()
  customerPhone?: string;
}
