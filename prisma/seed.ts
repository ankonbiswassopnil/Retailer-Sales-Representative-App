// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('adminpassword', 10);
  const repPass = await bcrypt.hash('reppassword', 10);

  await prisma.salesRep.upsert({
    where: { username: 'admin' },
    update: { passwordHash: adminPass },
    create: {
      username: 'admin',
      name: 'Admin User',
      phone: '01700000000',
      passwordHash: adminPass,
      role: 'ADMIN',
    },
  });

  await prisma.salesRep.upsert({
    where: { username: 'salesrep' },
    update: { passwordHash: repPass },
    create: {
      username: 'salesrep',
      name: 'Sales Rep',
      phone: '01711111111',
      passwordHash: repPass,
      role: 'SALES_REP',
    },
  });

  console.log('Seeded admin & salesrep');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());