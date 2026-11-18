import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAssetHealthTrend() {
    const assets = await this.prisma.asset.findMany({
      include: {
        predictions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const healthy = assets.filter(a => !a.predictions[0] || a.predictions[0].failureProbability < 0.3).length;
    const atRisk = assets.filter(a => a.predictions[0] && a.predictions[0].failureProbability >= 0.3 && a.predictions[0].failureProbability < 0.6).length;
    const critical = assets.filter(a => a.predictions[0] && a.predictions[0].failureProbability >= 0.6).length;

    return { healthy, atRisk, critical, total: assets.length };
  }

  async getIncidentStats() {
    const byCategory = await this.prisma.incident.groupBy({
      by: ['category'],
      _count: true,
    });
    const bySeverity = await this.prisma.incident.groupBy({
      by: ['severity'],
      _count: true,
    });
    const byStatus = await this.prisma.incident.groupBy({
      by: ['status'],
      _count: true,
    });

    return { byCategory, bySeverity, byStatus };
  }

  async getThreatTrend() {
    const threats = await this.prisma.threatEvent.findMany({
      orderBy: { createdAt: 'asc' },
    });

    // Group by day for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const trend = last7Days.map(day => ({
      date: day,
      count: threats.filter(t => t.createdAt.toISOString().split('T')[0] === day).length,
    }));

    return trend;
  }

  async getMaintenanceCosts() {
    // Simulated maintenance costs based on work orders
    const orders = await this.prisma.maintenanceOrder.findMany();
    const totalOrders = orders.length;
    const completed = orders.filter(o => o.status === 'COMPLETED').length;
    const totalCost = totalOrders * 1250; //  per work order (simulated)

    return {
      totalOrders,
      completed,
      totalCost,
      avgCost: totalOrders > 0 ? Math.round(totalCost / totalOrders) : 0,
    };
  }
}
