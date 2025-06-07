import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'thiago';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crie permissões se não existirem
  const permissionsData = [
    { name: 'canAccessDashboard' },
    { name: 'canManageUsers' },
    { name: 'canViewReports' },
  ];

  for (const perm of permissionsData) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }

  // Busque permissões para associar aos usuários
  const canAccessDashboard = await prisma.permission.findUnique({ where: { name: 'canAccessDashboard' } });
  const canManageUsers = await prisma.permission.findUnique({ where: { name: 'canManageUsers' } });
  const canViewReports = await prisma.permission.findUnique({ where: { name: 'canViewReports' } });

  if (!canAccessDashboard || !canManageUsers || !canViewReports) {
    throw new Error('Permissões não encontradas');
  }

  const usersData = [
    {
      email: 'user1@example.com',
      password: hashedPassword,
      name: 'User One',
      permissions: [canAccessDashboard.id, canManageUsers.id, canViewReports.id],
    },
    {
      email: 'user2@example.com',
      password: hashedPassword,
      name: 'User Two',
      permissions: [canAccessDashboard.id],
    },
    {
      email: 'user3@example.com',
      password: hashedPassword,
      name: 'User Three',
      permissions: [],
    },
  ];

  for (const userData of usersData) {
    // Upsert usuário sem permissões
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        password: userData.password,
        // ...não inclua permissions aqui...
      },
      create: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        // ...não inclua permissions aqui...
      },
    });

    // Atualize as permissões separadamente
    await prisma.user.update({
      where: { id: user.id },
      data: {
        permissions: {
          set: userData.permissions.map(id => ({ id })),
        },
      },
    });
  }

  console.log('Seed finalizado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
