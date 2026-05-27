import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Table, TableStatus, Prisma, BookingStatus } from '@prisma/client';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { QueryTableDto } from './dto/query-table.dto';
import { PaginatedTableResponseDto } from './dto/paginated-table-response.dto';
import { PaginatedTableWithBookingsResponseDto } from './dto/table-with-bookings.dto';

export interface SearchTablesFilters {
  name?: string;
  floorId?: string;
  status?: TableStatus;
}

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTableDto): Promise<Table> {
    const existing = await this.prisma.table.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Bàn với tên "${dto.name}" đã tồn tại`);
    }

    const floor = await this.prisma.floor.findUnique({
      where: { id: dto.floorId },
    });
    if (!floor) {
      throw new NotFoundException(`Không tìm thấy tầng với ID: ${dto.floorId}`);
    }

    return this.prisma.table.create({
      data: {
        name: dto.name,
        floorId: dto.floorId,
        area: dto.area,
        seats: dto.seats,
        status: dto.status,
      },
      include: {
        floor: true,
      },
    });
  }

  async findAll(): Promise<Table[]> {
    return this.prisma.table.findMany({
      orderBy: [{ name: 'asc' }],
      include: {
        floor: true,
      },
    });
  }

  async findByStatus(status: TableStatus): Promise<Table[]> {
    return this.prisma.table.findMany({
      where: { status },
      orderBy: [{ name: 'asc' }],
      include: {
        floor: true,
      },
    });
  }

  async search(filters: SearchTablesFilters): Promise<Table[]> {
    const where: Prisma.TableWhereInput = {};

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters.floorId) {
      where.floorId = filters.floorId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return this.prisma.table.findMany({
      where,
      orderBy: [{ name: 'asc' }],
      include: {
        floor: true,
      },
    });
  }

  async findOne(id: string): Promise<Table> {
    const table = await this.prisma.table.findUnique({
      where: { id },
      include: {
        floor: true,
      },
    });
    if (!table) {
      throw new NotFoundException(`Không tìm thấy bàn với ID: ${id}`);
    }
    return table;
  }

  async update(id: string, dto: UpdateTableDto): Promise<Table> {
    await this.findOne(id);

    const orderCount = await this.prisma.orderTable.count({
      where: {
        tableId: id,
        order: {
          status: 'SERVED',
        },
      },
    });

    if (orderCount > 0) {
      throw new ConflictException(
        'Không thể cập nhật bàn vì đang được phục vụ (SERVED)',
      );
    }

    if (dto.name) {
      const existing = await this.prisma.table.findUnique({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Bàn với tên "${dto.name}" đã tồn tại`);
      }
    }

    if (dto.floorId) {
      const floor = await this.prisma.floor.findUnique({
        where: { id: dto.floorId },
      });
      if (!floor) {
        throw new NotFoundException(
          `Không tìm thấy tầng với ID: ${dto.floorId}`,
        );
      }
    }

    return this.prisma.table.update({
      where: { id },
      data: {
        name: dto.name,
        floorId: dto.floorId,
        area: dto.area,
        seats: dto.seats,
        status: dto.status,
      },
      include: {
        floor: true,
      },
    });
  }

  async remove(id: string): Promise<Table> {
    await this.findOne(id);

    // Ensure no bookings exist for this table in the future
    const now = new Date();
    const futureBookings = await this.prisma.bookingTable.findMany({
      where: {
        tableId: id,
        booking: {
          AND: [{ bookingTime: { lte: now } }, { endTime: { gte: now } }],
        },
      },
    });
    if (futureBookings.length > 0) {
      throw new ConflictException(
        'Không thể xóa bàn vì có đặt bàn đang tồn tại',
      );
    }

    // Ensure no orders exist for this table
    const orderCount = await this.prisma.orderTable.count({
      where: { tableId: id },
    });
    if (orderCount > 0) {
      throw new ConflictException(
        'Không thể xóa bàn vì đang có đơn hàng liên kết',
      );
    }

    return this.prisma.table.delete({ where: { id } });
  }

  /**
   * Check if a set of tables are available for a given time range.
   * Throws ConflictException if any table is already booked.
   */
  async checkAvailability(
    tableIds: string[],
    start: Date,
    end: Date,
  ): Promise<void> {
    const overlapping = await this.prisma.bookingTable.findMany({
      where: {
        tableId: { in: tableIds },
        booking: {
          AND: [{ bookingTime: { lt: end } }, { endTime: { gt: start } }],
        },
      },
    });
    if (overlapping.length > 0) {
      const conflictedTableIds = overlapping.map((b) => b.tableId).join(', ');
      throw new ConflictException(
        `Bàn(s) ${conflictedTableIds} không khả dụng trong khoảng thời gian đã chọn`,
      );
    }
  }

  async getAvailableTables(
    bookingTime: Date,
    endTime?: Date,
    floorId?: string,
  ): Promise<Table[]> {
    let calculatedEndTime = endTime;

    if (!calculatedEndTime) {
      calculatedEndTime = new Date(bookingTime);
      const durationMinutes = 180;

      calculatedEndTime.setMinutes(
        calculatedEndTime.getMinutes() + durationMinutes,
      );
    }

    const bookedTableIds = await this.prisma.bookingTable.findMany({
      where: {
        booking: {
          status: {
            notIn: [BookingStatus.CANCELLED, BookingStatus.COMPLETED],
          },
          AND: [
            { bookingTime: { lt: calculatedEndTime } },
            { endTime: { gt: bookingTime } },
          ],
        },
      },
      select: {
        tableId: true,
      },
    });

    const bookedIds = bookedTableIds.map((bt) => bt.tableId);

    const availableTables = await this.prisma.table.findMany({
      where: {
        id: {
          notIn: bookedIds,
        },
        floorId: floorId,
        status: {
          in: ['AVAILABLE', 'RESERVED'],
        },
      },
      orderBy: [{ name: 'asc' }],
    });

    return availableTables;
  }

  async getAvailableTablesCount(
    bookingTime: Date,
    endTime?: Date,
  ): Promise<number> {
    let calculatedEndTime = endTime;

    if (!calculatedEndTime) {
      calculatedEndTime = new Date(bookingTime);
      const durationMinutes = 180;

      calculatedEndTime.setMinutes(
        calculatedEndTime.getMinutes() + durationMinutes,
      );
    }

    const bookedTableIds = await this.prisma.bookingTable.findMany({
      where: {
        booking: {
          AND: [
            { bookingTime: { lt: calculatedEndTime } },
            { endTime: { gt: bookingTime } },
          ],
        },
      },
      select: {
        tableId: true,
      },
    });

    const bookedIds = bookedTableIds.map((bt) => bt.tableId);

    const count = await this.prisma.table.count({
      where: {
        id: {
          notIn: bookedIds,
        },
        status: {
          in: ['AVAILABLE', 'RESERVED'],
        },
      },
    });

    return count;
  }

  async findAllWithPagination(
    queryDto: QueryTableDto,
  ): Promise<PaginatedTableResponseDto> {
    const { search, floorId, status, page = 1, limit = 10 } = queryDto;

    const where: Prisma.TableWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (floorId) {
      where.floorId = floorId;
    }

    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [tables, total] = await Promise.all([
      this.prisma.table.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ name: 'asc' }],
        include: {
          floor: true,
        },
      }),
      this.prisma.table.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: tables,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findAllWithBookingsAndPagination(
    queryDto: QueryTableDto,
  ): Promise<PaginatedTableWithBookingsResponseDto> {
    const { search, floorId, status, page = 1, limit = 10 } = queryDto;

    const where: Prisma.TableWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (floorId) {
      where.floorId = floorId;
    }

    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [tables, total] = await Promise.all([
      this.prisma.table.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ name: 'asc' }],
        include: {
          floor: true,
          bookings: {
            where: {
              booking: {
                status: BookingStatus.CONFIRMED,
              },
            },
            include: {
              booking: true,
            },
          },
        },
      }),
      this.prisma.table.count({ where }),
    ]);

    const tablesWithBookings = tables.map((table) => ({
      ...table,
      bookings: table.bookings.map((bt) => ({
        id: bt.booking.id,
        bookingTime: bt.booking.bookingTime,
        endTime: bt.booking.endTime,
        customerName: bt.booking.customerName,
        customerPhone: bt.booking.customerPhone,
      })),
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      data: tablesWithBookings,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}
