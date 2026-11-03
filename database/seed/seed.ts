import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Industrial Corp',
      status: 'ACTIVE',
      timezone: 'UTC',
    },
  });
  console.log(`✅ Organization created: ${org.name}`);

  // 2. Create Permissions
  const permissionsData = [
    { resource: 'asset', action: 'read' },
    { resource: 'asset', action: 'create' },
    { resource: 'asset', action: 'update' },
    { resource: 'asset', action: 'delete' },
    { resource: 'incident', action: 'read' },
    { resource: 'incident', action: 'create' },
    { resource: 'user', action: 'read' },
    { resource: 'user', action: 'create' },
  ];

  const permissions = [];
  for (const p of permissionsData) {
    const perm = await prisma.permission.upsert({
      where: { resource_action: { resource: p.resource, action: p.action } },
      update: {},
      create: p,
    });
    permissions.push(perm);
  }
  console.log(`✅ ${permissions.length} Permissions created`);

  // 3. Create Role
  const role = await prisma.role.create({
    data: {
      organizationId: org.id,
      name: 'Super Admin',
      isSystem: true,
    },
  });
  console.log(`✅ Role created: ${role.name}`);

  // 4. Assign Permissions to Role
  for (const perm of permissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: role.id,
        permissionId: perm.id,
      },
    });
  }
  console.log(`✅ Permissions assigned to ${role.name}`);

  // 5. Create User
  const user = await prisma.user.create({
    data: {
      organizationId: org.id,
      name: 'Super Admin',
      email: 'super@sentinel.local',
      passwordHash: 'temp_hash_here_123', // We'll replace this with actual hash later
      status: 'ACTIVE',
      mfaEnabled: false,
    },
  });
  console.log(`✅ User created: ${user.email}`);

  // 6. Assign Role to User
  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: role.id,
    },
  });
  console.log(`✅ Role assigned to User`);

  console.log('🌱 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });