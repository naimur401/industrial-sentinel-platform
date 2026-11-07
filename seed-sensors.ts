import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const asset = await prisma.asset.findFirst();
  if (!asset) return console.log('No asset found. Run main seed first.');

  const sensorTypes = [
    { type: 'TEMPERATURE', unit: '°C', threshold: 80 },
    { type: 'PRESSURE', unit: 'PSI', threshold: 150 },
    { type: 'VIBRATION', unit: 'mm/s', threshold: 10 },
  ];

  for (const s of sensorTypes) {
    const sensor = await prisma.sensor.create({
      data: {
        assetId: asset.id,
        sensorType: s.type,
        unit: s.unit,
        threshold: s.threshold,
      },
    });

    const anomaliesData = [
      { score: 0.92, severity: 'CRITICAL', description: 'Extreme value detected' },
      { score: 0.65, severity: 'HIGH', description: 'Abnormal deviation from baseline' },
      { score: 0.35, severity: 'MEDIUM', description: 'Slight deviation noticed' },
    ];

    for (const a of anomaliesData) {
      await prisma.anomaly.create({
        data: {
          sensorId: sensor.id,
          score: a.score,
          severity: a.severity as any,
          description: a.description,
        },
      });
    }
  }

  console.log('SUCCESS: Sensors and Anomalies created successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
