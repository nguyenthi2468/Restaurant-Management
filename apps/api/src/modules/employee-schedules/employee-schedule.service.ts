import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeScheduleDto } from './dto/employee-schedule/create-employee-schedule.dto';
import { UpdateEmployeeScheduleDto } from './dto/employee-schedule/update-employee-schedule.dto';
import { QueryEmployeeScheduleDto } from './dto/employee-schedule/query-employee-schedule.dto';

@Injectable()
export class EmployeeScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeScheduleDto: CreateEmployeeScheduleDto) {
    const { employeeId, shiftId, date } = createEmployeeScheduleDto;

    const employee = await this.prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Nhân viên với ID ${employeeId} không tìm thấy`);
    }

    const shift = await this.prisma.shift.findUnique({
      where: { id: shiftId },
    });

    if (!shift) {
      throw new NotFoundException(`Ca làm việc với ID ${shiftId} không tìm thấy`);
    }

    const existing = await this.prisma.employeeSchedule.findUnique({
      where: {
        employeeId_date_shiftId: {
          employeeId,
          date,
          shiftId,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        `Nhân viên đã được phân ca này vào ngày ${date.toISOString().split('T')[0]}`,
      );
    }

    return this.prisma.employeeSchedule.create({
      data: createEmployeeScheduleDto,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        shift: true,
      },
    });
  }

  async findAll(query: QueryEmployeeScheduleDto) {
    const { employeeId, shiftId, startDate, endDate, status, page = 1, limit = 10 } = query;

    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (shiftId) {
      where.shiftId = shiftId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      this.prisma.employeeSchedule.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          shift: true,
        },
        orderBy: { date: 'asc' },
        skip,
        take,
      }),
      this.prisma.employeeSchedule.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const schedule = await this.prisma.employeeSchedule.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        shift: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`Lịch làm việc với ID ${id} không tìm thấy`);
    }

    return schedule;
  }

  async update(id: string, updateEmployeeScheduleDto: UpdateEmployeeScheduleDto) {
    await this.findOne(id);

    return this.prisma.employeeSchedule.update({
      where: { id },
      data: updateEmployeeScheduleDto,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        shift: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.employeeSchedule.delete({
      where: { id },
    });
  }

  async findByEmployee(employeeId: string, startDate?: Date, endDate?: Date) {
    const where: any = { employeeId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    return this.prisma.employeeSchedule.findMany({
      where,
      include: {
        shift: true,
      },
      orderBy: { date: 'asc' },
    });
  }
}
