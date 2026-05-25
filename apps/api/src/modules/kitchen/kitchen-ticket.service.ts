import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKitchenTicketDto } from './dto/create-kitchen-ticket.dto';
import { UpdateKitchenTicketDto } from './dto/update-kitchen-ticket.dto';
import { KitchenTicketStatus, KitchenItemStatus } from '@prisma/client';
import { PusherService } from '../pusher/pusher.service';

@Injectable()
export class KitchenTicketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pusherService: PusherService,
  ) {}

  async create(createKitchenTicketDto: CreateKitchenTicketDto) {
    const { orderId, priority = 0, note, items } = createKitchenTicketDto;

    const hasNegativeQuantity = items?.some((item) => item.quantity < 0);
    const ticketStatus = hasNegativeQuantity
      ? KitchenTicketStatus.ACCEPTED
      : KitchenTicketStatus.PENDING;
    const itemStatus = hasNegativeQuantity
      ? KitchenItemStatus.SERVED
      : KitchenItemStatus.PENDING;

    const result = await this.prisma.$transaction(async (tx) => {
      const kitchenTicket = await tx.kitchenTicket.create({
        data: {
          orderId,
          priority,
          note,
          status: ticketStatus,
        },
      });

      if (items?.length) {
        await tx.kitchenTicketItem.createMany({
          data: items.map((item) => ({
            ticketId: kitchenTicket.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            note: item.note,
            status: itemStatus,
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

    await this.pusherService.trigger('kitchen-channel', 'ticket-created', {
      ticket: result,
    });

    return result;
  }

  async findAll(status?: KitchenTicketStatus) {
    return this.prisma.kitchenTicket.findMany({
      where: status ? { status } : undefined,
      include: {
        items: {
          include: {
            menuItem: true,
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
            menuItem: true,
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
            menuItem: true,
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
            menuItemId: item.menuItemId,
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
              menuItem: true,
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
    const result = await this.prisma.kitchenTicketItem.update({
      where: { id: ticketItemId },
      data: { status },
      include: {
        menuItem: true,
        ticket: true,
      },
    });

    await this.pusherService.trigger('kitchen-channel', 'ticket-item-updated', {
      item: result,
    });

    return result;
  }

  async acceptTicket(id: string, acceptedBy: string) {
    return this.prisma.$transaction(async (tx) => {
      const updatedTicket = await tx.kitchenTicket.update({
        where: { id },
        data: {
          status: KitchenTicketStatus.ACCEPTED,
          acceptedAt: new Date(),
        },
      });

      await tx.kitchenTicketItem.updateMany({
        where: { ticketId: id },
        data: {
          status: KitchenItemStatus.COOKING,
        },
      });

      return updatedTicket;
    });
  }

  async findItemsByStatus(status?: KitchenItemStatus) {
    return this.prisma.kitchenTicketItem.findMany({
      where: status ? { status } : undefined,
      include: {
        menuItem: true,
        ticket: true,
      },
    });
  }
}
