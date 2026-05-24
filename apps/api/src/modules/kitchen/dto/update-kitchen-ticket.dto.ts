import { PartialType } from '@nestjs/mapped-types';
import {
  IsInt,
  IsString,
  IsOptional,
  Min,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateKitchenTicketItemDto,
  CreateKitchenTicketDto,
} from './create-kitchen-ticket.dto';

export class UpdateKitchenTicketDto extends PartialType(
  CreateKitchenTicketDto,
) {
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
