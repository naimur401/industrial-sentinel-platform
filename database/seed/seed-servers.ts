// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const facility = await prisma.facility.findFirst();
  if (!facility) return console.log('No facility found.');

  await prisma.server.deleteMany({});

  const servers = [
    { hostname: 'web-prod-01', ip: '10.0.1.10', os: 'Ubuntu 22.04 LTS', env: 'production', status: 'ONLINE' },
    { hostname: 'web-prod-02', ip: '10.0.1.11', os: 'Ubuntu 22.04 LTS', env: 'production', status: 'ONLINE' },
    { hostname: 'db-primary', ip: '10.0.1.20', os: 'Debian 12', env: 'production', status: 'ONLINE' },
    { hostname: 'db-replica', ip: '10.0.1.21', os: 'Debian 12', env: 'production', status: 'DEGRADED' },
    { hostname: 'ai-worker-01', ip: '10.0.1.30', os: 'Ubuntu 22.04 LTS', env: 'production', status: 'ONLINE' },
    { hostname: 'redis-cache', ip: '10.0.1.40', os: 'Alpine Linux', env: 'production', status: 'ONLINE' },
    { hostname: 'staging-01', ip: '10.0.2.10', os: 'Ubuntu 20.04 LTS', env: 'staging', status: 'OFFLINE' },
    { hostname: 'monitoring', ip: '10.0.1.50', os: 'CentOS 9', env: 'production', status: 'ONLINE' },
  ];

  for (const s of servers) {
    await prisma.server.create({
      data: {
        facilityId: facility.id,
        hostname: s.hostname,
        ipAddress: s.ip,
        os: s.os,
        environment: s.env,
        status: s.status as any,
      },
    });
  }
  console.log('SUCCESS: 8 Servers created!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

