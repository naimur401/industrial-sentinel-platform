import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async predictRUL(assetId: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new Error('Asset not found');

    const response = await axios.post('http://localhost:8000/predict/rul', {
      asset_id: asset.id,
      asset_type: asset.type,
      criticality: asset.criticality,
    });

    const aiData = response.data;

    const prediction = await this.prisma.prediction.create({
      data: {
        assetId: asset.id,
        remainingUsefulLife: aiData.remaining_useful_life_days,
        failureProbability: aiData.failure_probability,
        confidence: aiData.confidence,
        recommendation: aiData.recommendation,
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
