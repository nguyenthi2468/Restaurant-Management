import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    return this.prisma.orderItem.create({
      data: createOrderItemDto,
    });
  }

  async findAll() {
    return this.prisma.orderItem.findMany();
  }

  async findOne(id: string) {
    return this.prisma.orderItem.findUnique({
      where: { id },
    });
  }

  async findByOrderId(orderId: number) {
    return this.prisma.orderItem.findMany({
      where: { orderId },
      include: {
        menuItem: true,
      },
    });
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    return this.prisma.orderItem.update({
      where: { id },
      data: updateOrderItemDto,
    });
  }

  async remove(id: string) {
    return this.prisma.orderItem.delete({
      where: { id },
    });
  }
}
