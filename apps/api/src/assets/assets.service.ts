import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.asset.findMany({
      include: { facility: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const totalAssets = await this.prisma.asset.count();
    const totalFacilities = await this.prisma.facility.count();
    return { totalAssets, totalFacilities };
  }

  async findOne(id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: { facility: true },
    });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async create(data: any) {
    const facility = await this.prisma.facility.findFirst();
    if (!facility) throw new NotFoundException('No facility found. Run seed first.');

    return this.prisma.asset.create({
      data: {
        name: data.name,
        type: data.type,
        criticality: data.criticality || 'MEDIUM',
        status: 'OPERATIONAL',
        location: data.location,
        facilityId: facility.id,
      },
    });
  }

  async getCriticalityDistribution() {
    const assets = await this.prisma.asset.groupBy({
      by: ['criticality'],
      _count: true,
    });
    return assets;
  }

  async getRecentActivity() {
    const recentIncidents = await this.prisma.incident.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
    const recentThreats = await this.prisma.threatEvent.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    });
    const recentMaintenance = await this.prisma.maintenanceOrder.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
    });

    return {
      incidents: recentIncidents,
      threats: recentThreats,
      maintenance: recentMaintenance,
    };
  }

  async getAIRiskSummary() {
    const predictions = await this.prisma.prediction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { asset: true },
    });

    if (predictions.length === 0) {
      return { avgRUL: 0, highRiskCount: 0, totalPredictions: 0 };
    }

    const avgRUL = predictions.reduce((sum, p) => sum + p.remainingUsefulLife, 0) / predictions.length;
    const highRiskCount = predictions.filter(p => p.failureProbability > 0.6).length;

    return {
      avgRUL: Math.round(avgRUL),
      highRiskCount,
      totalPredictions: predictions.length,
    };
  }
}
