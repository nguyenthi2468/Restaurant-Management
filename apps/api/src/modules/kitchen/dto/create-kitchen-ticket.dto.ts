import {
  IsInt,
  IsString,
  IsOptional,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateKitchenTicketItemDto {
  @ApiProperty({
    description: 'ID của OrderItem',
    example: 'orderitem_123abc',
  })
  @IsString()
  orderItemId: string;

  @ApiProperty({
    description: 'Số lượng món ăn',
    example: 2,
  })
  @IsInt()
  quantity: number;

  @ApiPropertyOptional({
    description: 'Ghi chú hoặc chú thích về món ăn',
    example: 'Với thêm',
  })
  @IsString()
  @IsOptional()
  note?: string;
}

export class CreateKitchenTicketDto {
  @ApiProperty({
    description: 'ID của đơn hàng',
    example: 123,
  })
  @IsInt()
  orderId: number;

  @ApiPropertyOptional({
    description: 'Mức độ ưu tiên (0=normal, 1=rush)',
    example: 0,
    minimum: 0,
    maximum: 1,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  priority?: number;

  @ApiPropertyOptional({
    description: 'Ghi chú của ticket',
    example: 'Nhanh lên',
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiPropertyOptional({
    description: 'Danh sách món ăn trong ticket',
    example: [
      {
        orderItemId: 'orderitem_123abc',
        quantity: 2,
        note: 'Không hành',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateKitchenTicketItemDto)
  items?: CreateKitchenTicketItemDto[];
}
