import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';
import { ACTION_KEY } from '../decorators/requires-action.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireAction = this.reflector.getAllAndOverride<{ action: string; mode: import('../constants/action-mode.enum').ActionMode }>(
      ACTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireAction) {
      return true; // No action required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { sub: string }; // From JwtAuthGuard

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { action, mode } = requireAction;

    // Get all permission IDs the user has through their roles
    const userRolePermissions = await this.prisma.userRole.findMany({
      where: { userId: user.sub },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    // Flatten and get unique permission IDs
    const userPermissionIds = Array.from(
      new Set(
        userRolePermissions.flatMap(ur =>
          ur.role.permissions.map(rp => rp.permission.id),
        ),
      ),
    );

    // Get all policies for the required action
    const policies = await this.prisma.policy.findMany({
      where: { action: { key: action } },
      include: { permission: true },
    });

    if (policies.length === 0) {
      // No policies defined for this action - deny by default for security
      return false;
    }

    // Get required permission IDs from policies
    const requiredPermissionIds = policies.map(p => p.permission.id);

    // Check permissions based on mode
    if (mode === 'ANY') {
      // User needs at least one of the required permissions
      return requiredPermissionIds.some(id => userPermissionIds.includes(id));
    } else {
      // mode === 'ALL' - User needs all required permissions
      return requiredPermissionIds.every(id => userPermissionIds.includes(id));
    }
  }
}