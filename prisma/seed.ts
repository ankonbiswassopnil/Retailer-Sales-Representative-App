// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash('adminpassword', 10);
  const repPass = await bcrypt.hash('reppassword', 10);

  // 1. Users
  const admin = await prisma.salesRep.upsert({
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

  const salesRep = await prisma.salesRep.upsert({
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

  // 2. Regions
  const dhaka = await prisma.region.upsert({
    where: { name: 'Dhaka' },
    update: {},
    create: { name: 'Dhaka' },
  });

  const sylhet = await prisma.region.upsert({
    where: { name: 'Sylhet' },
    update: {},
    create: { name: 'Sylhet' },
  });

  // 3. Areas
  // First, ensure Mirpur exists or create it, then use its id for upsert
  const mirpurArea = await prisma.area.findFirst({ where: { name: 'Mirpur', regionId: dhaka.id } });
  const mirpur = await prisma.area.upsert({
    where: { id: mirpurArea ? mirpurArea.id : 0 }, // Use 0 if not found, will create
    update: {},
    create: { name: 'Mirpur', regionId: dhaka.id },
  });

  // Find Bazar area by name and regionId first
  const bazarArea = await prisma.area.findFirst({ where: { name: 'Bazar', regionId: sylhet.id } });
  const bazar = await prisma.area.upsert({
    where: { id: bazarArea ? bazarArea.id : 0 }, // Use 0 if not found, will create
    update: {},
    create: { name: 'Bazar', regionId: sylhet.id },
  });

  // 4. Distributor & Territory (optional, but good)
  const dist1 = await prisma.distributor.upsert({
    where: { name: 'Dist Dhaka' },
    update: {},
    create: { name: 'Dist Dhaka' },
  });

  const terr1 = await prisma.territory.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Territory A', areaId: mirpur.id },
  });

  // 5. Retailers
  const r1 = await prisma.retailer.upsert({
    where: { uid: 'R1' },
    update: {},
    create: {
      uid: 'R1',
      name: 'Shop Dhaka',
      phone: '01711111111',
      regionId: dhaka.id,
      areaId: mirpur.id,
      distributorId: dist1.id,
      territoryId: terr1.id,
      points: 100,
      routes: 'Route A',
      notes: 'VIP',
    },
  });

  const r2 = await prisma.retailer.upsert({
    where: { uid: 'R2' },
    update: {},
    create: {
      uid: 'R2',
      name: 'Bazar Sylhet',
      regionId: sylhet.id,
      areaId: bazar.id,
    },
  });

  // 6. Assign
  await prisma.salesRepRetailer.upsert({
    where: { salesRepId_retailerId: { salesRepId: salesRep.id, retailerId: r1.id } },
    update: {},
    create: { salesRepId: salesRep.id, retailerId: r1.id },
  });

  await prisma.salesRepRetailer.upsert({
    where: { salesRepId_retailerId: { salesRepId: salesRep.id, retailerId: r2.id } },
    update: {},
    create: { salesRepId: salesRep.id, retailerId: r2.id },
  });

  console.log('Seeded everything!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });