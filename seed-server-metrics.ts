import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const servers = await prisma.server.findMany();
  if (servers.length === 0) return console.log('No servers found.');

  await prisma.serverMetric.deleteMany({});

  for (const server of servers) {
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - i);
      await prisma.serverMetric.create({
        data: {
          serverId: server.id,
          cpu: 20 + Math.random() * 60,
          memory: 30 + Math.random() * 50,
          disk: 40 + Math.random() * 30,
          network: 10 + Math.random() * 80,
          timestamp,
        },
      });
    }
  }
  console.log('SUCCESS: 24h metrics created for all servers!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
