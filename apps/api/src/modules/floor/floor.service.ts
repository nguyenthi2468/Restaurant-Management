import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Floor } from '@prisma/client';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Injectable()
export class FloorService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFloorDto): Promise<Floor> {
    const existing = await this.prisma.floor.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Tầng với tên "${dto.name}" đã tồn tại`);
    }

    return this.prisma.floor.create({
      data: {
        name: dto.name,
      },
    });
  }

  async findAll(): Promise<Floor[]> {
    return this.prisma.floor.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { tables: true },
        },
      },
    });
  }

  async findOne(id: string): Promise<Floor> {
    const floor = await this.prisma.floor.findUnique({
      where: { id },
      include: {
        tables: {
          orderBy: { name: 'asc' },
        },
      },
    });
    if (!floor) {
      throw new NotFoundException(`Không tìm thấy tầng với ID: ${id}`);
    }
    return floor;
  }

  async update(id: string, dto: UpdateFloorDto): Promise<Floor> {
    await this.findOne(id);

    if (dto.name) {
      const existing = await this.prisma.floor.findUnique({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Tầng với tên "${dto.name}" đã tồn tại`);
      }
    }

    return this.prisma.floor.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<Floor> {
    const floor = await this.prisma.floor.findUnique({
      where: { id },
      include: {
        _count: {
          select: { tables: true },
        },
      },
    });

    if (!floor) {
      throw new NotFoundException(`Không tìm thấy tầng với ID: ${id}`);
    }

    if (floor._count.tables > 0) {
      throw new BadRequestException(
        `Không thể xóa tầng "${floor.name}" vì còn ${floor._count.tables} bàn đang sử dụng`,
      );
    }

    return this.prisma.floor.delete({
      where: { id },
    });
  }
}
