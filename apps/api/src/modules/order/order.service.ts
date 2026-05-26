import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, TableStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { tableIds, items, ...orderData } = createOrderDto;

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          total: orderData.total || 0,
          note: orderData.note,
          createdById: userId,
          customerId: orderData.customerId,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          orderTables: tableIds?.length
            ? {
                create: tableIds.map((tableId) => ({
                  table: {
                    connect: { id: tableId },
                  },
                })),
              }
            : undefined,
          items: {
            create: items?.map((item) => ({
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
          orderTables: {
            include: {
              table: true,
            },
          },
        },
      });

      if (tableIds?.length) {
        await tx.table.updateMany({
          where: {
            id: {
              in: tableIds,
            },
          },
          data: {
            status: TableStatus.OCCUPIED,
          },
        });
      }

      return order;
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: true,
        orderTables: {
          include: {
            table: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        orderTables: {
          include: {
            table: true,
          },
        },
        payments: true,
      },
    });
  }

  async findServedOrderByTableId(tableId: string) {
    return this.prisma.order.findFirst({
      where: {
        status: OrderStatus.SERVED,
        orderTables: {
          some: {
            tableId: tableId,
          },
        },
      },
    });
  }

  async cancel(orderId: number) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELLED,
        },
        include: {
          orderTables: true,
        },
      });

      if (order.orderTables.length > 0) {
        const tableIds = order.orderTables.map((ot) => ot.tableId);
        await tx.table.updateMany({
          where: {
            id: {
              in: tableIds,
            },
          },
          data: {
            status: TableStatus.AVAILABLE,
          },
        });
      }

      return order;
    });
  }

  async updateNote(orderId: number, note?: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { note },
      include: {
        orderTables: {
          include: {
            table: true,
          },
        },
      },
    });
  }
}
