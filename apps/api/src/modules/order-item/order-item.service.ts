import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { KitchenItemStatus, KitchenTicketStatus } from '@prisma/client';

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
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
  
  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    return this.prisma.$transaction(async (tx) => {
      const orderItem = await tx.orderItem.findUnique({
        where: { id },
      });

      if (!orderItem) {
        throw new Error('Order item not found');
      }

      const {note, ...updateData} = updateOrderItemDto
      if (
        updateOrderItemDto.quantity &&
        updateOrderItemDto.quantity < orderItem.quantity
      ) {
        await tx.kitchenTicket.create({
          data: {
            orderId: orderItem.orderId,
            items: {
              create: [
                {
                  orderItemId: id,
                  note,
                  status: KitchenItemStatus.SERVED,
                  quantity: updateOrderItemDto.quantity - orderItem.quantity,
                },
              ],
            },
            status: KitchenTicketStatus.ACCEPTED,
          },
        });
      }

      return tx.orderItem.update({
        where: { id },
        data: updateData,
      });
    });
  }

  async remove(id: string) {
    return this.prisma.orderItem.delete({
      where: { id },
    });
  }
}
