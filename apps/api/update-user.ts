import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUser() {
  const user = await prisma.user.update({
    where: { email: 'hakimhakvin@gmail.com' },
    data: {
      nickname: 'hakim_hakvin',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hakim',
      bio: 'Jazz enthusiast and developer'
    }
  });

  console.log('User updated:', user);
}

updateUser()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });