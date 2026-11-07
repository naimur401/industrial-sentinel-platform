import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class SensorsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sensor.findMany({
      include: { asset: true, anomalies: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAnomalies() {
    return this.prisma.anomaly.findMany({
      include: { sensor: { include: { asset: true } } },
      orderBy: { detectedAt: 'desc' },
    });
  }

  async detectAndSaveAnomaly(sensorId: string, value: number) {
    const sensor = await this.prisma.sensor.findUnique({ where: { id: sensorId } });
    if (!sensor) throw new Error('Sensor not found');

    const response = await axios.post('http://localhost:8000/detect/anomaly', {
      sensor_id: sensorId,
      value: value,
      threshold: sensor.threshold,
    });

    const aiData = response.data;

    if (aiData.is_anomaly) {
      return this.prisma.anomaly.create({
        data: {
          sensorId: sensorId,
          score: aiData.anomaly_score,
          severity: aiData.severity,
          description: aiData.explanation,
        },
      });
    }

    return { message: 'No anomaly detected', details: aiData };
  }

  async getReadings(sensorId: string) {
    return this.prisma.sensorReading.findMany({
      where: { sensorId },
      orderBy: { timestamp: 'desc' },
      take: 24,
    });
  }
}
