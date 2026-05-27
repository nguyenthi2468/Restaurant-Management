import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CompleteOrderDto } from './dto/complete-order.dto';
import { FindAllOrdersDto } from './dto/find-all-orders.dto';
import {
  OrderStatus,
  TableStatus,
  PaymentMethod,
  PaymentStatus,
  KitchenTicketStatus,
  KitchenItemStatus,
} from '@prisma/client';
import { VnpayService } from './vnpay.service';

interface VnpayReturnParams {
  vnp_TxnRef: string;
  vnp_TransactionStatus: string;
  vnp_Amount?: string;
  vnp_TransactionNo?: string;
  [key: string]: any;
}

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vnpayService: VnpayService,
  ) {}

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

  async findAll(query: FindAllOrdersDto) {
    const { status, search, startDate, endDate, page = 1, limit = 10 } = query;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.createdBy = {
        firstName: {
          contains: search,
          mode: 'insensitive',
        },
        lastName: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        include: {
          items: true,
          orderTables: {
            include: {
              table: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        orderTables: {
          include: {
            table: {
              include: {
                floor: true,
              },
            },
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
      const tickets = await tx.kitchenTicket.findMany({
        where: {
          orderId: orderId,
        },
      });

      for (const ticket of tickets) {
        await tx.kitchenTicket.update({
          where: { id: ticket.id },
          data: {
            status: 'CANCELLED',
          },
        });

        await tx.kitchenTicketItem.updateMany({
          where: {
            ticketId: ticket.id,
          },
          data: {
            status: 'CANCELLED',
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

  async completeOrder(orderId: number, completeOrderDto: CompleteOrderDto) {
    const { paymentMethod, totalAmount } = completeOrderDto;

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.COMPLETED,
          total: totalAmount,
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
      if (paymentMethod === PaymentMethod.CASH) {
        await tx.payment.create({
          data: {
            orderId: orderId,
            transactionCode: `PAY_${Date.now()}_${orderId}`,
            amount: totalAmount,
            method: paymentMethod,
            status: PaymentStatus.SUCCESS,
          },
        });
      }

      const tickets = await tx.kitchenTicket.findMany({
        where: {
          orderId: orderId,
        },
      });

      for (const ticket of tickets) {

        await tx.kitchenTicketItem.updateMany({
          where: {
            ticketId: ticket.id,
            status: KitchenItemStatus.PENDING,
          },
          data: {
            status: KitchenItemStatus.SERVED,
          },
        });
      }

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

      return tx.order.findUnique({
        where: { id: orderId },
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
    });
  }

  async createVnpayPayment(orderId: number): Promise<string> {
    const order = await this.findOne(orderId);

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    if (order.status === OrderStatus.COMPLETED) {
      throw new ConflictException('Order is already completed');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new ConflictException('Cannot pay for a cancelled order');
    }

    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        orderId: orderId,
      },
    });
    const amount = Number(
      orderItems.reduce((acc, item) => acc + Number(item.price), 0),
    );
    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        total: amount,
      },
    });
    const orderIdStr = orderId.toString();
    const orderInfo = `Order payment ${orderId}`;

    return this.vnpayService.createPaymentUrl(amount, orderIdStr, orderInfo);
  }

  async handleVnpayReturn(
    params: VnpayReturnParams,
  ): Promise<{ responseCode: string; orderId: string }> {
    const isValidSignature = this.vnpayService.verifyResponse(params);

    if (!isValidSignature) {
      throw new ConflictException('Invalid VNPay signature');
    }

    const { vnp_TxnRef, vnp_TransactionStatus, vnp_Amount, vnp_TransactionNo } =
      params;

    const orderId = parseInt(vnp_TxnRef, 10);
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderTables: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    const actualAmount = vnp_Amount
      ? Number(vnp_Amount) / 100
      : Number(order.total);

    const transactionCode = vnp_TransactionNo || `VNP_${Date.now()}_${orderId}`;

    if (vnp_TransactionStatus === '00') {
      await this.prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.COMPLETED,
          },
        });

        await tx.payment.create({
          data: {
            orderId: orderId,
            transactionCode,
            method: PaymentMethod.VNPAY,
            amount: actualAmount,
            status: PaymentStatus.SUCCESS,
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
      });

      return { responseCode: vnp_TransactionStatus, orderId: vnp_TxnRef };
    } else {
      await this.prisma.payment.create({
        data: {
          orderId: orderId,
          transactionCode,
          method: PaymentMethod.VNPAY,
          amount: actualAmount,
          status: PaymentStatus.FAILED,
        },
      });

      throw new ConflictException(
        `VNPay transaction failed with status: ${vnp_TransactionStatus}`,
      );
    }
  }
}
