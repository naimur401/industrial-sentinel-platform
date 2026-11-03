import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.asset.findMany({
      include: {
        facility: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getStats() {
    const totalAssets = await this.prisma.asset.count();
    const totalFacilities = await this.prisma.facility.count();
    return { totalAssets, totalFacilities };
  }
}
