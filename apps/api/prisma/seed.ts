import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient, ActionMode } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const permissions = await Promise.all(
    [
      ['users.read', 'View users'],
      ['users.write', 'Create and update users'],
      ['users.delete', 'Delete users'],
      ['roles.read', 'View roles'],
      ['roles.write', 'Manage roles'],
      ['permissions.read', 'View permissions'],
      ['permissions.write', 'Manage permissions'],
      ['actions.read', 'View actions'],
      ['actions.write', 'Manage actions'],
    ].map(([name, description]) =>
      prisma.permission.upsert({
        where: { name },
        update: { description },
        create: { name, description },
      }),
    ),
  );

  const permissionByName = Object.fromEntries(
    permissions.map((p) => [p.name, p]),
  );

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: { description: 'System administrator' },
    create: { name: 'admin', description: 'System administrator' },
  });

  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: { description: 'Restaurant customer' },
    create: { name: 'customer', description: 'Restaurant customer' },
  });

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: { roleId: adminRole.id, permissionId: permission.id },
    });
  }

  const adminActions = [
    ['users.manage', 'Manage users', ['users.read', 'users.write']],
    ['roles.manage', 'Manage roles', ['roles.read', 'roles.write']],
    ['permissions.manage', 'Manage permissions', ['permissions.read', 'permissions.write']],
    ['actions.manage', 'Manage actions', ['actions.read', 'actions.write']],
  ] as const;

  for (const [key, description, permissionNames] of adminActions) {
    const action = await prisma.action.upsert({
      where: { key },
      update: { description, enabled: true, mode: ActionMode.ANY },
      create: { key, description, enabled: true, mode: ActionMode.ANY },
    });

    for (const permissionName of permissionNames) {
      const permission = permissionByName[permissionName];
      await prisma.policy.upsert({
        where: {
          actionId_permissionId: {
            actionId: action.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: { actionId: action.id, permissionId: permission.id },
      });
    }
  }

  const adminEmail = 'admin@restaurant.com';
  const passwordHash = await bcrypt.hash('Admin@12345', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      firstName: 'Admin',
      lastName: 'User',
      passwordHash,
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      firstName: 'Admin',
      lastName: 'User',
      passwordHash,
      emailVerified: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: adminUser.id, roleId: adminRole.id },
    },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  console.log('Seed completed.');
  console.log(`Admin login: ${adminEmail} / Admin@12345`);
  console.log(`Default register role: ${customerRole.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
