import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacilitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.facility.findMany({
      include: {
        _count: {
          select: {
            assets: true,
            incidents: true,
          },
        },
        organization: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    const org = await this.prisma.organization.findFirst();
    if (!org) throw new Error('No organization found');

    return this.prisma.facility.create({
      data: {
        organizationId: org.id,
        name: data.name,
        location: data.location,
        status: 'ACTIVE',
      },
    });
  }
}
