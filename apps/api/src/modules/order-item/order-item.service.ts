import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
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

      const tickets = await tx.kitchenTicket.findMany({
        where: { orderId: orderItem.orderId },
      });

      const { note, ...updateData } = updateOrderItemDto;
      if (
        updateOrderItemDto.quantity &&
        updateOrderItemDto.quantity < orderItem.quantity &&
        tickets.length > 0
      ) {
        await tx.kitchenTicket.create({
          data: {
            orderId: orderItem.orderId,
            items: {
              create: [
                {
                  menuItemId: orderItem.menuItemId,
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
    return this.prisma.$transaction(async (tx) => {
      const orderItem = await tx.orderItem.findUnique({
        where: { id },
      });
      if (!orderItem) {
        throw new Error('Order item not found');
      }

      const tickets = await tx.kitchenTicket.findMany({
        where: { orderId: orderItem.orderId },
      });

      if (tickets.length > 0) {
        await tx.kitchenTicket.create({
          data: {
            orderId: orderItem.orderId,
            items: {
              create: [
                {
                  menuItemId: orderItem.menuItemId,
                  status: KitchenItemStatus.SERVED,
                  quantity: -orderItem.quantity,
                },
              ],
            },
            status: KitchenTicketStatus.ACCEPTED,
          },
        });
      }
      return tx.orderItem.delete({
        where: { id },
      });
    });
  }

  async updateNote(id: string, updateNoteDto: UpdateNoteDto) {
    return this.prisma.orderItem.update({
      where: { id },
      data: {
        note: updateNoteDto.note,
      },
    });
  }
}
