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
  floor?: string;
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

    return this.prisma.table.create({
      data: {
        name: dto.name,
        floor: dto.floor,
        area: dto.area,
        seats: dto.seats,
        status: dto.status,
      },
    });
  }

  async findAll(): Promise<Table[]> {
    return this.prisma.table.findMany({
      orderBy: [{ name: 'asc' }],
    });
  }

  async findByStatus(status: TableStatus): Promise<Table[]> {
    return this.prisma.table.findMany({
      where: { status },
      orderBy: [{ floor: 'asc' }, { name: 'asc' }],
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

    if (filters.floor) {
      where.floor = {
        contains: filters.floor,
        mode: 'insensitive',
      };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return this.prisma.table.findMany({
      where,
      orderBy: [{ floor: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string): Promise<Table> {
    const table = await this.prisma.table.findUnique({ where: { id } });
    if (!table) {
      throw new NotFoundException(`Không tìm thấy bàn với ID: ${id}`);
    }
    return table;
  }

  async update(id: string, dto: UpdateTableDto): Promise<Table> {
    await this.findOne(id); // throws 404 if not found

    if (dto.name) {
      const existing = await this.prisma.table.findUnique({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Bàn với tên "${dto.name}" đã tồn tại`);
      }
    }

    return this.prisma.table.update({
      where: { id },
      data: {
        name: dto.name,
        floor: dto.floor,
        area: dto.area,
        seats: dto.seats,
        status: dto.status,
      },
    });
  }

  async remove(id: string): Promise<Table> {
    await this.findOne(id); // throws 404 if not found

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
}