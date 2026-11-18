import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModelsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.mLModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const model = await this.prisma.mLModel.findUnique({
      where: { id },
    });
    if (!model) throw new NotFoundException('Model not found');
    return model;
  }

  async create(data: any) {
    return this.prisma.mLModel.create({
      data: {
        name: data.name,
        type: data.type,
        version: data.version,
        algorithm: data.algorithm,
        description: data.description,
        status: data.status || 'STAGED',
        metricsJson: data.metricsJson || {},
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.mLModel.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async getEvaluations(modelId: string) {
    return this.prisma.modelEvaluation.findMany({
      where: { modelId },
      orderBy: { evaluatedAt: 'desc' },
    });
  }
}
