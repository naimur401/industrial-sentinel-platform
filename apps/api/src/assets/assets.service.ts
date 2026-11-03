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
}
