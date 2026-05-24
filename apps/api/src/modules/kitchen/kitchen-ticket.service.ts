import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKitchenTicketDto } from './dto/create-kitchen-ticket.dto';
import { UpdateKitchenTicketDto } from './dto/update-kitchen-ticket.dto';
import { KitchenTicketStatus, KitchenItemStatus } from '@prisma/client';

@Injectable()
export class KitchenTicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createKitchenTicketDto: CreateKitchenTicketDto) {
    const { orderId, priority = 0, note, items } = createKitchenTicketDto;

    return this.prisma.$transaction(async (tx) => {
      const kitchenTicket = await tx.kitchenTicket.create({
        data: {
          orderId,
          priority,
          note,
          status: KitchenTicketStatus.PENDING,
        },
      });

      if (items?.length) {
        await tx.kitchenTicketItem.createMany({
          data: items.map((item) => ({
            ticketId: kitchenTicket.id,
            orderItemId: item.orderItemId,
            quantity: item.quantity,
            note: item.note,
            status: KitchenItemStatus.PENDING,
          })),
        });
      }

      return this.prisma.kitchenTicket.findUnique({
        where: { id: kitchenTicket.id },
        include: {
          items: true,
          order: true,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.kitchenTicket.findMany({
      include: {
        items: {
          include: {
            orderItem: true,
          },
        },
        order: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.kitchenTicket.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            orderItem: {
              include: {
                menuItem: true,
              },
            },
          },
        },
        order: true,
      },
    });
  }

  async findByOrderId(orderId: number) {
    return this.prisma.kitchenTicket.findMany({
      where: { orderId },
      include: {
        items: {
          include: {
            orderItem: {
              include: {
                menuItem: true,
              },
            },
          },
        },
        order: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, updateKitchenTicketDto: UpdateKitchenTicketDto) {
    const { priority, note, items } = updateKitchenTicketDto;

    return this.prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.kitchenTicket.update({
        where: { id },
        data: {
          priority,
          note,
        },
      });

      if (items?.length) {
        await tx.kitchenTicketItem.deleteMany({
          where: { ticketId: id },
        });

        await tx.kitchenTicketItem.createMany({
          data: items.map((item) => ({
            ticketId: id,
            orderItemId: item.orderItemId,
            quantity: item.quantity,
            note: item.note,
            status: KitchenItemStatus.PENDING,
          })),
        });
      }

      return this.prisma.kitchenTicket.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              orderItem: {
                include: {
                  menuItem: true,
                },
              },
            },
          },
          order: true,
        },
      });
    });
  }

  async remove(id: string) {
    return this.prisma.kitchenTicket.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: KitchenTicketStatus) {
    return this.prisma.kitchenTicket.update({
      where: { id },
      data: { status },
    });
  }

  async updateItemStatus(ticketItemId: string, status: KitchenItemStatus) {
    return this.prisma.kitchenTicketItem.update({
      where: { id: ticketItemId },
      data: { status },
    });
  }

  async acceptTicket(id: string, acceptedBy: string) {
    return this.prisma.kitchenTicket.update({
      where: { id },
      data: {
        status: KitchenTicketStatus.ACCEPTED,
        acceptedAt: new Date(),
      },
    });
  }

  async completeTicket(id: string) {
    return this.prisma.kitchenTicket.update({
      where: { id },
      data: {
        status: KitchenTicketStatus.SERVED,
        completedAt: new Date(),
      },
    });
  }
}
