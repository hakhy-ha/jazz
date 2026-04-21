import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('@@Hakim123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'hakimhakvin@gmail.com' },
    update: {},
    create: {
      email: 'hakimhakvin@gmail.com',
      password: hashedPassword,
      name: 'Hakim Hakvin',
      nickname: 'hakim_hakvin',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hakim',
      phone: '+1234567890',
      bio: 'Jazz enthusiast and developer'
    },
  });

  console.log('User created:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });