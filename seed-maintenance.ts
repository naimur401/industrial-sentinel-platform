import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const assets = await prisma.asset.findMany({ take: 5 });
  if (assets.length === 0) {
    console.log('No assets found.');
    return;
  }

  const orders = [
    { title: 'Vibration check on PUMP-001', description: 'Investigate abnormal vibration readings', priority: 'HIGH', status: 'OPEN', dueInDays: 3 },
    { title: 'Compressor oil replacement', description: 'Scheduled oil replacement for COMPRESSOR-002', priority: 'MEDIUM', status: 'IN_PROGRESS', dueInDays: 7 },
    { title: 'Annual pressure valve inspection', description: 'Inspect all pressure valves in Area 1', priority: 'CRITICAL', status: 'OPEN', dueInDays: 1 },
    { title: 'Motor bearing lubrication', description: 'Lubricate bearings on MOTOR-003', priority: 'LOW', status: 'COMPLETED', dueInDays: -2 },
    { title: 'Pipeline corrosion check', description: 'Visual inspection for pipeline corrosion', priority: 'MEDIUM', status: 'OVERDUE', dueInDays: -5 },
  ];

  for (let i = 0; i < orders.length; i++) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + orders[i].dueInDays);
    
    await prisma.maintenanceOrder.create({
      data: {
        assetId: assets[i % assets.length].id,
        title: orders[i].title,
        description: orders[i].description,
        priority: orders[i].priority as any,
        status: orders[i].status as any,
        dueDate: dueDate,
        assignedTo: 'Maint. Engineer',
      },
    });
  }
  console.log('SUCCESS: 5 Demo Maintenance Orders created!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
