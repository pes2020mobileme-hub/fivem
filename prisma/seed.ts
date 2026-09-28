import { PrismaClient, Role, Framework, WhitelistStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user (replace discordId with real one)
  const admin = await prisma.user.upsert({
    where: { discordId: '000000000000000000' },
    update: {},
    create: {
      discordId: '000000000000000000',
      username: 'Admin',
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.username);

  // Sample jobs
  const jobs = [
    {
      name: 'police',
      label: 'Police',
      grades: [
        { grade: 0, name: 'recruit', label: 'Recruit', salary: 50 },
        { grade: 1, name: 'officer', label: 'Officer', salary: 75 },
        { grade: 2, name: 'sergeant', label: 'Sergeant', salary: 100 },
        { grade: 3, name: 'lieutenant', label: 'Lieutenant', salary: 125 },
        { grade: 4, name: 'boss', label: 'Chief', salary: 150 },
      ],
      framework: Framework.QBCORE,
    },
    {
      name: 'ambulance',
      label: 'EMS',
      grades: [
        { grade: 0, name: 'trainee', label: 'Trainee', salary: 50 },
        { grade: 1, name: 'paramedic', label: 'Paramedic', salary: 75 },
        { grade: 2, name: 'doctor', label: 'Doctor', salary: 100 },
        { grade: 3, name: 'boss', label: 'Chief', salary: 125 },
      ],
      framework: Framework.QBCORE,
    },
    {
      name: 'mechanic',
      label: 'Mechanic',
      grades: [
        { grade: 0, name: 'recruit', label: 'Recruit', salary: 40 },
        { grade: 1, name: 'novice', label: 'Novice', salary: 60 },
        { grade: 2, name: 'experienced', label: 'Experienced', salary: 80 },
        { grade: 3, name: 'boss', label: 'Boss', salary: 100 },
      ],
      framework: Framework.QBCORE,
    },
    {
      name: 'unemployed',
      label: 'Unemployed',
      grades: [{ grade: 0, name: 'unemployed', label: 'Unemployed', salary: 0 }],
      framework: Framework.QBCORE,
    },
  ];

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { name: job.name },
      update: {},
      create: job,
    });
  }

  console.log('✅ Jobs seeded');

  // Sample coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME1000' },
    update: {},
    create: {
      code: 'WELCOME1000',
      type: 'CASH',
      value: 1000,
      maxUses: 100,
      isActive: true,
    },
  });

  console.log('✅ Coupon seeded');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
