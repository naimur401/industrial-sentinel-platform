import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const facility = await prisma.facility.findFirst();
  if (!facility) {
    console.log('No facility found. Run main seed first.');
    return;
  }

  const incidents = [
    { title: 'High vibration detected on PUMP-001', severity: 'CRITICAL', category: 'MAINTENANCE', status: 'DETECTED' },
    { title: 'Unauthorized access attempt on server', severity: 'HIGH', category: 'SECURITY', status: 'INVESTIGATING' },
    { title: 'Pipeline pressure anomaly', severity: 'MEDIUM', category: 'OPERATIONAL', status: 'RESOLVED' },
    { title: 'Compressor temperature exceeded threshold', severity: 'CRITICAL', category: 'MAINTENANCE', status: 'DETECTED' },
    { title: 'Network latency spike detected', severity: 'LOW', category: 'INFRASTRUCTURE', status: 'CLOSED' },
  ];

  for (const inc of incidents) {
    await prisma.incident.create({
      data: {
        facilityId: facility.id,
        title: inc.title,
        description: 'Auto-generated demo incident for testing.',
        severity: inc.severity as any,
        category: inc.category as any,
        status: inc.status as any,
      },
    });
  }
  console.log('SUCCESS: 5 Demo Incidents created successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
