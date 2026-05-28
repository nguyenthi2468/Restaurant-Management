import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/shift/create-shift.dto';
import { UpdateShiftDto } from './dto/shift/update-shift.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createShiftDto: CreateShiftDto) {
    return this.prisma.shift.create({
      data: createShiftDto,
    });
  }

  async findAll() {
    return this.prisma.shift.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.shift.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
      include: {
        schedules: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!shift) {
      throw new NotFoundException(`Shift với ID ${id} không tìm thấy`);
    }

    return shift;
  }

  async update(id: string, updateShiftDto: UpdateShiftDto) {
    await this.findOne(id);

    return this.prisma.shift.update({
      where: { id },
      data: updateShiftDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.shift.delete({
      where: { id },
    });
  }
}
