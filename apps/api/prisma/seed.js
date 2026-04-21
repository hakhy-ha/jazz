const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

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
      phone: '+1234567890',
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