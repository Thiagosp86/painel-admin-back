import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'thiago';
  const hashedPassword = await bcrypt.hash(password, 10);

  const usersData = [
    { email: 'user1@example.com', password: hashedPassword, name: 'User One' },
    { email: 'user2@example.com', password: hashedPassword, name: 'User Two' },
    { email: 'user3@example.com', password: hashedPassword, name: 'User Three' },
  ];

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
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
