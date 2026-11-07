import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sensors = await prisma.sensor.findMany();
  if (sensors.length === 0) return console.log('No sensors found.');

  for (const sensor of sensors) {
    const threshold = sensor.threshold || 100;
    for (let i = 0; i < 24; i++) {
      const value = threshold + (Math.random() * 40 - 20);
      const time = new Date();
      time.setHours(time.getHours() - i);

      await prisma.sensorReading.create({
        data: {
          sensorId: sensor.id,
          value: value,
          timestamp: time,
        },
      });
    }
  }
  console.log('SUCCESS: 24 hours of sensor readings created for all sensors!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
