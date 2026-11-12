import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getAssetReport() {
    const assets = await this.prisma.asset.findMany({
      include: {
        facility: true,
        predictions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    });

    return assets;
  }

  async getIncidentReport() {
    const incidents = await this.prisma.incident.findMany({
      include: { facility: true },
      orderBy: { createdAt: 'desc' },
    });
    return incidents;
  }

  async getSecurityReport() {
    const threats = await this.prisma.threatEvent.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return threats;
  }

  async getInfrastructureReport() {
    // Placeholder: Will be connected to real server metrics later
    return [];
  }

  async getSummary() {
    const totalAssets = await this.prisma.asset.count();
    const totalIncidents = await this.prisma.incident.count();
    const totalThreats = await this.prisma.threatEvent.count();
    const totalFacilities = await this.prisma.facility.count();

    return {
      totalAssets,
      totalIncidents,
      totalThreats,
      totalFacilities,
      generatedAt: new Date().toISOString(),
    };
  }
}
