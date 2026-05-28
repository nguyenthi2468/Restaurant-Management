import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/attendance/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/attendance/update-attendance.dto';
import { QueryAttendanceDto } from './dto/attendance/query-attendance.dto';
import { ClockInDto } from './dto/attendance/clock-in.dto';
import { ClockOutDto } from './dto/attendance/clock-out.dto';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const { employeeId, date } = createAttendanceDto;

    const employee = await this.prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Nhân viên với ID ${employeeId} không tìm thấy`);
    }

    const existing = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Bản ghi chấm công cho nhân viên này đã tồn tại vào ngày ${date.toISOString().split('T')[0]}`,
      );
    }

    return this.prisma.attendance.create({
      data: createAttendanceDto,
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
    });
  }

  async findAllWithPagination(query: QueryAttendanceDto) {
    const { employeeId, startDate, endDate, status, page = 1, limit = 10 } = query;

    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
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

    const [attendances, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        skip,
        take: limit,
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
        orderBy: { date: 'desc' },
      }),
      this.prisma.attendance.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: attendances as any,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
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
      },
    });

    if (!attendance) {
      throw new NotFoundException(`Bản ghi chấm công với ID ${id} không tìm thấy`);
    }

    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    await this.findOne(id);

    return this.prisma.attendance.update({
      where: { id },
      data: updateAttendanceDto,
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
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.attendance.delete({
      where: { id },
    });
  }

  async clockIn(clockInDto: ClockInDto) {
    const { employeeId, clockInTime } = clockInDto;

    const employee = await this.prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Nhân viên với ID ${employeeId} không tìm thấy`);
    }

    const date = new Date(clockInTime);
    date.setHours(0, 0, 0, 0);

    const existing = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date,
        },
      },
    });

    if (existing) {
      if (existing.clockIn) {
        throw new BadRequestException('Nhân viên đã chấm công vào hôm nay');
      }

      return this.prisma.attendance.update({
        where: { id: existing.id },
        data: {
          clockIn: clockInTime,
          status: AttendanceStatus.ON_TIME,
        },
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
      });
    }

    return this.prisma.attendance.create({
      data: {
        employeeId,
        date,
        clockIn: clockInTime,
        status: AttendanceStatus.ON_TIME,
      },
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
    });
  }

  async clockOut(clockOutDto: ClockOutDto) {
    const { employeeId, clockOutTime } = clockOutDto;

    const date = new Date(clockOutTime);
    date.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date,
        },
      },
    });

    if (!attendance) {
      throw new NotFoundException('Không tìm thấy bản ghi chấm công vào');
    }

    if (!attendance.clockIn) {
      throw new BadRequestException('Nhân viên chưa chấm công vào');
    }

    if (attendance.clockOut) {
      throw new BadRequestException('Nhân viên đã chấm công ra hôm nay');
    }

    const workHours = this.calculateWorkHours(attendance.clockIn, clockOutTime);
    const overtimeHours = workHours > 8 ? workHours - 8 : 0;

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut: clockOutTime,
        workHours,
        overtimeHours,
      },
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

    return this.prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  private calculateWorkHours(clockIn: Date, clockOut: Date): number {
    const diffMs = clockOut.getTime() - clockIn.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 100) / 100;
  }
}
