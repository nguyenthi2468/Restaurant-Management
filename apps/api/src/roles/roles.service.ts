import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('Role already exists');
    }

    return this.prisma.role.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async update(id: string, dto: CreateRoleDto) {
    await this.ensureRoleExists(id);

    return this.prisma.role.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
      },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.ensureRoleExists(id);
    await this.prisma.role.delete({ where: { id } });
    return { message: 'Role deleted' };
  }

  async assignPermissions(id: string, dto: AssignPermissionsDto) {
    await this.ensureRoleExists(id);

    const permissions = await this.prisma.permission.findMany({
      where: { id: { in: dto.permissionIds } },
    });

    if (permissions.length !== dto.permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    await this.prisma.$transaction([
      this.prisma.rolePermission.deleteMany({ where: { roleId: id } }),
      this.prisma.rolePermission.createMany({
        data: dto.permissionIds.map((permissionId) => ({
          roleId: id,
          permissionId,
        })),
      }),
    ]);

    return this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  private async ensureRoleExists(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
  }
}
