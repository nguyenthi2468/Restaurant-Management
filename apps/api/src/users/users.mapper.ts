import { ActionMode, Prisma } from '../../generated/prisma/client';

const userWithRolesInclude = {
  roles: {
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  },
  avatar: true,
} satisfies Prisma.UserInclude;

export type UserWithRoles = Prisma.UserGetPayload<{
  include: typeof userWithRolesInclude;
}>;

export const userWithRolesIncludeConfig = userWithRolesInclude;

export function mapUserToResponse(
  user: UserWithRoles,
  allowedActions: string[],
) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roles: user.roles.map(({ role }) => ({
      id: role.id,
      name: role.name,
    })),
    avatar: user.avatar,
    allowedActions,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function resolveAllowedActions(
  user: UserWithRoles,
  actions: Array<{
    key: string;
    enabled: boolean;
    mode: ActionMode;
    policies: Array<{ permissionId: string }>;
  }>,
): string[] {
  const permissionIds = new Set(
    user.roles.flatMap(({ role }) =>
      role.permissions.map(({ permissionId }) => permissionId),
    ),
  );

  return actions
    .filter((action) => {
      if (!action.enabled || action.policies.length === 0) {
        return false;
      }

      const checks = action.policies.map((policy) =>
        permissionIds.has(policy.permissionId),
      );

      return action.mode === ActionMode.ALL
        ? checks.every(Boolean)
        : checks.some(Boolean);
    })
    .map((action) => action.key);
}
