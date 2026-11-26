import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async predictRUL(assetId: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new Error('Asset not found');

    // Simulate sensor values (later fetch real readings)
    const sensorData = {
      temperature: 650 + Math.random() * 40,
      vibration: 0.05 + Math.random() * 0.06,
      pressure: 100 + Math.random() * 50,
    };

    // Call Python AI Service (host.docker.internal for docker-to-host)
    const response = await axios.post('http://host.docker.internal:8000/predict/rul/from-sensors', sensorData);

    const aiData = response.data;

    // Save prediction
    const prediction = await this.prisma.prediction.create({
      data: {
        assetId: asset.id,
        remainingUsefulLife: aiData.remaining_useful_life_days,
        failureProbability: 1 - aiData.confidence,
        confidence: aiData.confidence,
        recommendation: aiData.remaining_useful_life_days < 30 ? 'Schedule urgent maintenance' : 'Asset is healthy',
      },
    });

    return prediction;
  }

  async getLatestPredictions() {
    return this.prisma.prediction.findMany({
      include: { asset: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
}
