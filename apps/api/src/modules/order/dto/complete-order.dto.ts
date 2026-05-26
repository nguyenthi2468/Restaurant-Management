import { IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CompleteOrderDto {
  @ApiProperty({
    description: 'Phương thức thanh toán',
    enum: PaymentMethod,
    example: 'CASH',
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Tổng số tiền thanh toán',
    example: 300000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  totalAmount: number;
}
