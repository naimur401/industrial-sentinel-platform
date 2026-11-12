import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found. Run main seed first.');
    return;
  }

  const notifications = [
    { title: 'Critical Alert: PUMP-001 Vibration', message: 'Vibration exceeded threshold by 45%. Immediate attention required.', severity: 'CRITICAL', read: false },
    { title: 'New Threat Detected', message: 'SQL Injection attempt from 192.168.1.105 detected by IDS.', severity: 'HIGH', read: false },
    { title: 'Maintenance Due', message: 'COMPRESSOR-0030 requires scheduled maintenance in 5 days.', severity: 'MEDIUM', read: false },
    { title: 'Incident Assigned', message: 'You have been assigned to incident INC-2026-001.', severity: 'MEDIUM', read: true },
    { title: 'Asset Created', message: 'New asset PUMP-999 added to Main Refinery.', severity: 'LOW', read: true },
    { title: 'Anomaly Detected', message: 'Temperature sensor on MOTOR-001 shows abnormal behavior.', severity: 'HIGH', read: false },
  ];

  for (const notif of notifications) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: notif.title,
        message: notif.message,
        severity: notif.severity as any,
        read: notif.read,
      },
    });
  }
  console.log('SUCCESS: 6 Demo Notifications created!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
