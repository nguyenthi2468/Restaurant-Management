import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TableService } from '../table/table.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreateBookingMenuItemDto } from './dto/create-booking-menu-item.dto';
import { QueryBookingDto } from './dto/query-booking.dto';
import { QueryBookingByTableDto } from './dto/query-booking-by-table.dto';
import { PaginatedBookingResponseDto } from './dto/paginated-booking-response.dto';
import {
  Booking,
  BookingStatus,
  DepositStatus,
  PaymentMethod,
  PaymentStatus,
  TableStatus,
} from '@prisma/client';
import { VnpayService } from './vnpay.service';
import { Prisma } from '@prisma/client'; // Import Prisma types
import { MailService } from '../mail/mail.service'; // Import MailService

interface VnpayReturnParams {
  vnp_TxnRef: string;
  vnp_TransactionStatus: string;
  [key: string]: any; // Allow other properties
}

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tableService: TableService,
    private readonly vnpayService: VnpayService,
    private readonly mailService: MailService, // Inject MailService
  ) {}

  /**
   * Create a new booking.
   * - Checks table availability.
   * - Evaluates whether a deposit is required based on business criteria.
   */
  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { tables, preOrderItems, ...bookingData } = createBookingDto;

    if (!bookingData.endTime) {
      bookingData.endTime = this.calculateEndTime(
        bookingData.bookingTime,
        bookingData.numberOfGuests,
      );
    }

    // 1. Kiểm tra tính khả dụng của các bàn
    if (tables && tables.length > 0) {
      const tableIds = tables.map((t) => t.tableId);
      try {
        await this.tableService.checkAvailability(
          tableIds,
          bookingData.bookingTime,
          bookingData.endTime,
        );
      } catch (err) {
        if (err instanceof ConflictException) {
          throw err;
        }
        throw new ConflictException('Lỗi khi kiểm tra khả dụng bàn');
      }
    }

    // 2. ✅ THÊM: Validate menuItemId tồn tại trước khi tạo booking
    if (preOrderItems && preOrderItems.length > 0) {
      const menuItemIds = preOrderItems.map((item) => item.menuItemId);

      const existingMenuItems = await this.prisma.menuItem.findMany({
        where: { id: { in: menuItemIds } },
        select: { id: true },
      });

      const existingIds = new Set(existingMenuItems.map((m) => m.id));
      const notFoundIds = menuItemIds.filter((id) => !existingIds.has(id));

      if (notFoundIds.length > 0) {
        throw new NotFoundException(
          `Không tìm thấy MenuItem với id: ${notFoundIds.join(', ')}`,
        );
      }
    }
    // 2. ✅ THÊM: Validate tableId tồn tại trước khi tạo booking
    if (tables && tables.length > 0) {
      const tableIds = tables.map((t) => t.tableId);

      const existingTables = await this.prisma.table.findMany({
        where: { id: { in: tableIds } },
        select: { id: true },
      });

      const existingIds = new Set(existingTables.map((t) => t.id));
      const notFoundIds = tableIds.filter((id) => !existingIds.has(id));

      if (notFoundIds.length > 0) {
        throw new NotFoundException(
          `Không tìm thấy Table với id: ${notFoundIds.join(', ')}`,
        );
      }
    }
    // 3. Đánh giá yêu cầu đặt cọc và tính số tiền cọc
    const { depositAmount, depositStatus } = this.evaluateDepositRequirement(
      bookingData,
      preOrderItems,
    );

    const booking = await this.prisma.booking.create({
      data: {
        ...bookingData,
        endTime: bookingData.endTime,
        depositAmount,
        depositStatus,
        bookingTables: {
          create: tables?.map((t) => ({
            table: { connect: { id: t.tableId } },
          })),
        },
        preOrderItems: preOrderItems?.length
          ? {
              create: preOrderItems.map((item) => ({
                menuItem: { connect: { id: item.menuItemId } },
                quantity: item.quantity,
                price: item.price,
              })),
            }
          : undefined,
      },
      include: {
        bookingTables: {
          include: {
            table: true,
          },
        },
        preOrderItems: true,
        payments: true,
      },
    });

    // Gửi email xác nhận khi tạo booking thành công
    if (booking.customerEmail) {
      await this.mailService.sendBookingConfirmationBookedEmail(booking);
    }

    return booking;
  }

  async findAll(): Promise<Booking[]> {
    return this.prisma.booking.findMany({
      include: {
        bookingTables: true,
        preOrderItems: true,
        payments: true,
      },
    });
  }

  async findAllWithPagination(
    queryDto: QueryBookingDto,
  ): Promise<PaginatedBookingResponseDto> {
    const { search, status, page = 1, limit = 10 } = queryDto;

    const where: Prisma.BookingWhereInput = {};

    if (search) {
      where.OR = [
        {
          customerName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          customerPhone: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          bookingTables: {
            include: {
              table: {
                include: {
                  floor: true,
                },
              },
            },
          },
          preOrderItems: {
            include: {
              menuItem: true,
            },
          },
          payments: true,
        },
        orderBy: {
          bookingTime: 'desc',
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: bookings as any,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findMyBookingsWithPagination(
    customerId: string,
    queryDto: QueryBookingDto,
  ): Promise<PaginatedBookingResponseDto> {
    const { search, status, page = 1, limit = 10 } = queryDto;

    const where: Prisma.BookingWhereInput = {
      customerId,
    };

    if (search) {
      where.OR = [
        {
          customerName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          customerPhone: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          bookingTables: {
            include: {
              table: {
                include: {
                  floor: true,
                },
              },
            },
          },
          preOrderItems: {
            include: {
              menuItem: true,
            },
          },
          payments: true,
        },
        orderBy: {
          bookingTime: 'desc',
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: bookings as any,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findByTableIdWithPagination(
    tableId: string,
    queryDto: QueryBookingByTableDto,
  ): Promise<PaginatedBookingResponseDto> {
    const { search, page = 1, limit = 10 } = queryDto;

    const where: Prisma.BookingWhereInput = {
      status: 'CONFIRMED',
      bookingTables: {
        some: {
          tableId,
        },
      },
    };

    if (search) {
      where.OR = [
        {
          customerName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          customerPhone: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          bookingTables: {
            include: {
              table: {
                include: {
                  floor: true,
                },
              },
            },
          },
          preOrderItems: {
            include: {
              menuItem: true,
            },
          },
          payments: true,
        },
        orderBy: {
          bookingTime: 'desc',
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: bookings as any,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        bookingTables: {
          include: {
            table: {
              include: {
                floor: true,
              },
            },
          },
        },
        preOrderItems: {
          include: {
            menuItem: true,
          },
        },
        payments: true,
      },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const { tables, preOrderItems, ...scalarData } = updateBookingDto;

    // Prepare the data object for Prisma update
    const data: Prisma.BookingUpdateInput = {
      // Spread scalar fields. Prisma client usually handles number to Decimal conversion.
      ...scalarData,

      // Conditionally update bookingTables relation
      ...(tables !== undefined && {
        bookingTables: {
          deleteMany: {}, // Clear existing associations
          create:
            tables.length > 0
              ? tables.map((t) => ({
                  table: { connect: { id: t.tableId } },
                }))
              : [], // Create new associations if provided, or empty array if clearing
        },
      }),

      // Conditionally update preOrderItems relation
      ...(preOrderItems !== undefined && {
        preOrderItems: {
          deleteMany: {}, // Clear existing associations
          create:
            preOrderItems.length > 0
              ? preOrderItems.map((item) => ({
                  menuItem: { connect: { id: item.menuItemId } },
                  quantity: item.quantity,
                  price: item.price, // Prisma should handle number to Decimal conversion here
                }))
              : [], // Create new associations if provided, or empty array if clearing
        },
      }),
    };

    const updated = await this.prisma.booking.update({
      where: { id },
      data,
      include: {
        bookingTables: true,
        preOrderItems: true,
      },
    });

    return updated;
  }

  async remove(id: string): Promise<Booking> {
    return this.prisma.booking.delete({
      where: { id },
    });
  }

  private calculateEndTime(bookingTime: Date, numberOfGuests: number): Date {
    const endTime = new Date(bookingTime);
    let durationMinutes: number;

    if (numberOfGuests >= 1 && numberOfGuests <= 4) {
      durationMinutes = 90;
    } else if (numberOfGuests >= 5 && numberOfGuests <= 8) {
      durationMinutes = 120;
    } else {
      durationMinutes = 180;
    }

    endTime.setMinutes(endTime.getMinutes() + durationMinutes);
    return endTime;
  }

  /**
   * Đánh giá xem có cần đặt cọc hay không và tính số tiền cọc.
   * Tiêu chí:
   * - Số lượng khách >= 8
   * - Giờ đặt trong khung giờ cao điểm (18:00‑20:00)
   * - Giá trị món đặt trước >= 500,000 VND
   * - (Có thể mở rộng để kiểm tra khu vực VIP)
   */
  private evaluateDepositRequirement(
    bookingData: Omit<CreateBookingDto, 'tables'>,
    preOrderItems?: CreateBookingMenuItemDto[],
  ): { depositAmount: number; depositStatus: DepositStatus } {
    const PEAK_START_HOUR = 18;
    const PEAK_END_HOUR = 20;
    const GUEST_THRESHOLD = 8;
    const PREORDER_VALUE_THRESHOLD = 500000; // VND

    let requiresDeposit = false;
    let amount = 0;

    // 1. Số lượng khách
    if (bookingData.numberOfGuests >= GUEST_THRESHOLD) {
      requiresDeposit = true;
    }

    // 2. Giờ cao điểm
    const bookingHour = new Date(bookingData.bookingTime).getHours();
    if (bookingHour >= PEAK_START_HOUR && bookingHour < PEAK_END_HOUR) {
      requiresDeposit = true;
    }

    // 3. Giá trị món đặt trước
    if (preOrderItems && preOrderItems.length > 0) {
      const totalPreorder = preOrderItems.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.quantity),
        0,
      );
      if (totalPreorder >= PREORDER_VALUE_THRESHOLD) {
        requiresDeposit = true;
      }
    }

    if (requiresDeposit) {
      // Đặt cọc 20% tổng giá trị dự kiến, tối thiểu 100,000 VND
      const baseAmount = preOrderItems?.length
        ? preOrderItems.reduce(
            (sum, item) => sum + Number(item.price) * Number(item.quantity),
            0,
          )
        : 0;
      amount = Math.max(100000, Math.round(baseAmount * 0.2));
    }

    return {
      depositAmount: amount,
      depositStatus: requiresDeposit
        ? DepositStatus.PENDING
        : DepositStatus.PAID,
    };
  }

  /**
   * Duyệt (thanh toán) cọc cho một booking.
   */
  async approveDeposit(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    if (booking.depositStatus === DepositStatus.PAID) {
      throw new ConflictException('Deposit already paid');
    }
    // Move deposit to PAID
    const updated = await this.prisma.booking.update({
      where: { id },
      data: { depositStatus: DepositStatus.PAID },
    });
    // Refunding not performed here; this is a placeholder in case of future changes
    return updated;
  }

  /**
   * Refund deposit for a booking.
   */
  async refundDeposit(id: string): Promise<Booking> {
    const booking = await this.findOne(id);
    if (booking.depositStatus !== DepositStatus.PAID) {
      throw new ConflictException('Deposit is not paid or cannot be refunded');
    }
    // Placeholder for actual refund through VNPay API when available
    return this.prisma.booking.update({
      where: { id },
      data: { depositStatus: DepositStatus.REFUNDED, depositAmount: 0 },
      include: { bookingTables: true, preOrderItems: true, payments: true },
    });
  }

  /**
   * Chấp nhận đặt bạn.
   * Trạng thái chuyển thành CONFIRMED.
   */
  async confirmBooking(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { bookingTables: true }, // Include bookingTables to get table IDs
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    if (booking.status !== BookingStatus.PENDING) {
      throw new ConflictException(
        'Booking is not in a state that can be confirmed',
      );
    }

    // Cập nhật trạng thái bàn thành RESERVED (hoặc OCCUPIED)
    // const tableIds = booking.bookingTables.map((bt) => bt.tableId);
    // await this.prisma.table.updateMany({
    //   where: { id: { in: tableIds } },
    //   data: { status: 'RESERVED' }, // Hoặc 'OCCUPIED' tùy theo nghiệp vụ
    // });

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CONFIRMED },
      include: { bookingTables: { include: { table: true } } },
    });

    // Gửi email xác nhận
    await this.mailService.sendBookingConfirmationEmail(updatedBooking);

    return updatedBooking;
  }

  /**
   * Khách đến nhận bàn đặt trạng thái COMPLETED và cập nhật trạng thái bàn thành AVAILABLE.
   */
  async completeBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { bookingTables: true, preOrderItems: true }, // Include bookingTables to get table IDs
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new ConflictException('Only confirmed bookings can be completed');
    }

    // Cập nhật trạng thái bàn thành AVAILABLE
    const tableIds = booking.bookingTables.map((bt) => bt.tableId);
    const tables = await this.prisma.table.findMany({
      where: { id: { in: tableIds }, status: TableStatus.OCCUPIED },
    });
    if (tables.length > 0) {
      throw new ConflictException('Some tables are not available');
    }
    await this.prisma.table.updateMany({
      where: { id: { in: tableIds } },
      data: { status: TableStatus.OCCUPIED },
    });

    const order = await this.prisma.order.create({
      data: {
        total: booking.preOrderItems.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.quantity),
          0,
        ),
        createdById: userId,
        customerId: booking.customerId,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        items: {
          create: booking.preOrderItems.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        orderTables: {
          create: booking.bookingTables.map((bt) => ({
            tableId: bt.tableId,
          })),
        },
      },
      include: {
        items: true,
        orderTables: true,
      },
    });

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.COMPLETED },
    });
  }

  /**
   * Hủy một booking, đặt trạng thái CANCELLED và cập nhật trạng thái bàn thành AVAILABLE.
   */
  async cancelBooking(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { bookingTables: true }, // Include bookingTables to get table IDs
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    if (
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.CANCELLED
    ) {
      throw new ConflictException(
        'Cannot cancel a completed or already cancelled booking',
      );
    }

    // Cập nhật trạng thái bàn thành AVAILABLE
    const tableIds = booking.bookingTables.map((bt) => bt.tableId);
    await this.prisma.table.updateMany({
      where: { id: { in: tableIds } },
      data: { status: 'AVAILABLE' },
    });

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  /**
   * Mark a booking as NO_SHOW.
   * Updates table status to AVAILABLE.
   */
  async noShowBooking(id: string): Promise<Booking> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { bookingTables: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    if (
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.CANCELLED ||
      booking.status === BookingStatus.NO_SHOW
    ) {
      throw new ConflictException(
        'Cannot mark as NO_SHOW for completed, cancelled, or already no-show booking',
      );
    }

    const tableIds = booking.bookingTables.map((bt) => bt.tableId);

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.NO_SHOW },
    });
  }

  /**
   * Initiates the VNPay payment process for a booking's deposit.
   */
  async createVnpayPayment(id: string): Promise<string> {
    const booking = await this.findOne(id);

    if (booking.depositStatus !== DepositStatus.PENDING) {
      throw new ConflictException('Deposit is not pending or already paid.');
    }

    const amount = Number(booking.depositAmount);
    const orderId = booking.id;
    const orderInfo = `Booking deposit ${booking.id}`;

    return this.vnpayService.createPaymentUrl(amount, orderId, orderInfo);
  }

  /**
   * Handles the return from VNPay after payment attempt.
   * Creates a Payment record for successful or failed transactions.
   */
  async handleVnpayReturn(
    params: VnpayReturnParams,
  ): Promise<{ responseCode: string; bookingId: string }> {
    const isValidSignature = this.vnpayService.verifyResponse(params);

    if (!isValidSignature) {
      throw new ConflictException('Invalid VNPay signature');
    }

    const { vnp_TxnRef, vnp_TransactionStatus, vnp_Amount, vnp_TransactionNo } =
      params;

    const booking = await this.prisma.booking.findUnique({
      where: { id: vnp_TxnRef },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with id ${vnp_TxnRef} not found`);
    }

    // Calculate actual amount from VNPay (amount is multiplied by 100)
    const actualAmount = vnp_Amount
      ? Number(vnp_Amount) / 100
      : Number(booking.depositAmount);

    // Generate transaction code from VNPay or create one
    const transactionCode =
      vnp_TransactionNo || `VNP_${Date.now()}_${vnp_TxnRef}`;

    if (vnp_TransactionStatus === '00') {
      // Payment successful - Create SUCCESS payment record and update booking
      const [updatedBooking] = await this.prisma.$transaction([
        this.prisma.booking.update({
          where: { id: vnp_TxnRef },
          data: {
            depositStatus: DepositStatus.PAID,
            // status: BookingStatus.CONFIRMED,
          },
        }),
        this.prisma.payment.create({
          data: {
            bookingId: vnp_TxnRef,
            transactionCode,
            method: PaymentMethod.VNPAY,
            amount: actualAmount,
            status: PaymentStatus.SUCCESS,
          },
        }),
      ]);

      return { responseCode: vnp_TransactionStatus, bookingId: vnp_TxnRef };
    } else {
      // Payment failed - Create FAILED payment record
      await this.prisma.payment.create({
        data: {
          bookingId: vnp_TxnRef,
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
