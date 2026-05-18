import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsString()
  menuItemId!: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  price!: number;
}

export class CreateOrderDto {
  @IsString()
  tableId!: string;

  @IsNumber()
  total!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
