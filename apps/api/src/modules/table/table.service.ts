import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Table, TableStatus } from '@prisma/client';

@Injectable()
export class TableService {
  constructor(private prisma: PrismaService) {}

  async create(data: { number: number; capacity: number }): Promise<Table> {
    return await this.prisma.table.create({
      data,
    });
  }

  async findAll(): Promise<Table[]> {
    return await this.prisma.table.findMany();
  }

  async findOne(id: string): Promise<Table | null> {
    return await this.prisma.table.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: { capacity?: number; status?: TableStatus },
  ): Promise<Table> {
    return await this.prisma.table.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Table> {
    return await this.prisma.table.delete({
      where: { id },
    });
  }
}
