import { KitchenTicketStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { PusherService } from "../pusher/pusher.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class KitchenService {
  constructor(
    private prisma: PrismaService,
    private pusher: PusherService,
  ) {}

  async createTicket(orderId: number, items: any[]) {
    const ticket = await this.prisma.kitchenTicket.create({
      data: {
        orderId,
        items: { create: items },
      },
    });

    // 🔔 Gửi thông báo realtime xuống bếp
    await this.pusher.trigger(
      'kitchen-notifications',   // channel
      'new-ticket',              // event
      {
        ticketId: ticket.id,
        orderId:  ticket.orderId,
        items: items?.map(i => ({
          name:     i.menuItem.name,
          quantity: i.quantitySent,
          note:     i.note,
        })) || [],
        sentAt: ticket.sentAt,
      },
    );

    return ticket;
  }

  async updateTicketStatus(ticketId: string, status: KitchenTicketStatus) {
    const ticket = await this.prisma.kitchenTicket.update({
      where: { id: ticketId },
      data:  { status },
    });

    // 🔔 Thông báo cho phục vụ khi bếp xong
    await this.pusher.trigger(
      `order-${ticket.orderId}`,   // channel riêng per order
      'ticket-status-changed',
      { ticketId, status },
    );

    return ticket;
  }
}