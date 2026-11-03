import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.findFirst();
  if (!org) {
    console.log('No organization found. Run main seed first.');
    return;
  }

  const facility = await prisma.facility.create({
    data: {
      organizationId: org.id,
      name: 'Main Refinery',
      location: 'Dhaka',
    },
  });

  const assetTypes = ['PUMP', 'MOTOR', 'COMPRESSOR', 'TANK', 'PIPELINE'] as const;
  
  for (let i = 1; i <= 30; i++) {
    const type = assetTypes[Math.floor(Math.random() * assetTypes.length)];
    await prisma.asset.create({
      data: {
        facilityId: facility.id,
        name: type + '-00' + i,
        type: type,
        criticality: i % 5 === 0 ? 'CRITICAL' : 'MEDIUM',
        status: 'OPERATIONAL',
        location: 'Area ' + (Math.floor(i/10) + 1),
      },
    });
  }

  console.log('SUCCESS: 1 Facility and 30 Assets created successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
