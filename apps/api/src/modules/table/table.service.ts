import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Table, TableStatus, Prisma } from '@prisma/client';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

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

    const orderCount = await this.prisma.order.count({
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
}
