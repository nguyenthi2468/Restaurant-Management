import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import {
  mapUserToResponse,
  resolveAllowedActions,
  userWithRolesIncludeConfig,
} from './users.mapper';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: userWithRolesIncludeConfig,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const allowedActions = await this.getAllowedActionsForUser(user);
    return mapUserToResponse(user, allowedActions);
  }

  async findAll(query: PaginationQueryDto) {
    const limit = query.limit ?? 20;
    const offset = query.offset ?? 0;

    const where: Prisma.UserWhereInput = {};

    if (query.q) {
      where.OR = [
        { email: { contains: query.q, mode: 'insensitive' } },
        { firstName: { contains: query.q, mode: 'insensitive' } },
        { lastName: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    if (query.role) {
      where.roles = {
        some: {
          role: {
            name: query.role,
          },
        },
      };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: userWithRolesIncludeConfig,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    const actions = await this.prisma.action.findMany({
      where: { enabled: true },
      include: { policies: true },
    });

    const data = users.map((user) =>
      mapUserToResponse(user, resolveAllowedActions(user, actions)),
    );

    return {
      data,
      meta: { limit, offset, total },
    };
  }

  async assignRoles(userId: string, roleIds: string[]) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.prisma.role.findMany({
      where: { id: { in: roleIds } },
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('One or more roles not found');
    }

    await this.prisma.$transaction([
      this.prisma.userRole.deleteMany({ where: { userId } }),
      this.prisma.userRole.createMany({
        data: roleIds.map((roleId) => ({ userId, roleId })),
      }),
    ]);

    return this.getProfile(userId);
  }

  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName ?? user.firstName,
        lastName: data.lastName ?? user.lastName,
      },
    });

    return this.getProfile(userId);
  }

  private async getAllowedActionsForUser(
    user: Prisma.UserGetPayload<{ include: typeof userWithRolesIncludeConfig }>,
  ) {
    const actions = await this.prisma.action.findMany({
      where: { enabled: true },
      include: { policies: true },
    });

    return resolveAllowedActions(user, actions);
  }
}
