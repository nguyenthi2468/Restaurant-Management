import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeOffRequestDto } from './dto/time-off-request/create-time-off-request.dto';
import { UpdateTimeOffRequestDto } from './dto/time-off-request/update-time-off-request.dto';
import { QueryTimeOffRequestDto } from './dto/time-off-request/query-time-off-request.dto';
import { TimeOffRequestStatus } from '@prisma/client';

@Injectable()
export class TimeOffRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTimeOffRequestDto: CreateTimeOffRequestDto) {
    const { employeeId, startDate, endDate } = createTimeOffRequestDto;

    const employee = await this.prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Nhân viên với ID ${employeeId} không tìm thấy`);
    }

    if (startDate > endDate) {
      throw new BadRequestException('Ngày bắt đầu phải trước ngày kết thúc');
    }

    return this.prisma.timeOffRequest.create({
      data: createTimeOffRequestDto,
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

  async findAll(query: QueryTimeOffRequestDto) {
    const { employeeId, type, status, startDate, endDate, page = 1, limit = 10 } = query;

    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.OR = [
        {
          startDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          endDate: {
            gte: startDate,
            lte: endDate,
          },
        },
      ];
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [data, total] = await Promise.all([
      this.prisma.timeOffRequest.findMany({
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
          reviewedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.timeOffRequest.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const timeOffRequest = await this.prisma.timeOffRequest.findUnique({
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
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!timeOffRequest) {
      throw new NotFoundException(`Yêu cầu nghỉ phép với ID ${id} không tìm thấy`);
    }

    return timeOffRequest;
  }

  async update(id: string, updateTimeOffRequestDto: UpdateTimeOffRequestDto) {
    await this.findOne(id);

    return this.prisma.timeOffRequest.update({
      where: { id },
      data: updateTimeOffRequestDto,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        reviewedBy: {
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

    return this.prisma.timeOffRequest.delete({
      where: { id },
    });
  }

  async approve(id: string, reviewerId: string, reviewNote?: string) {
    const timeOffRequest = await this.findOne(id);

    if (timeOffRequest.status !== TimeOffRequestStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể phê duyệt yêu cầu đang chờ xử lý');
    }

    return this.prisma.timeOffRequest.update({
      where: { id },
      data: {
        status: TimeOffRequestStatus.APPROVED,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
        reviewNote,
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
        reviewedBy: {
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

  async reject(id: string, reviewerId: string, reviewNote?: string) {
    const timeOffRequest = await this.findOne(id);

    if (timeOffRequest.status !== TimeOffRequestStatus.PENDING) {
      throw new BadRequestException('Chỉ có thể từ chối yêu cầu đang chờ xử lý');
    }

    return this.prisma.timeOffRequest.update({
      where: { id },
      data: {
        status: TimeOffRequestStatus.REJECTED,
        reviewedById: reviewerId,
        reviewedAt: new Date(),
        reviewNote,
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
        reviewedBy: {
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

  async findByEmployee(employeeId: string) {
    return this.prisma.timeOffRequest.findMany({
      where: { employeeId },
      include: {
        reviewedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
