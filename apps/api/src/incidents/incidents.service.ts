import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.incident.findMany({
      include: { facility: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: any) {
    const facility = await this.prisma.facility.findFirst();
    if (!facility) throw new Error('No facility found');

    return this.prisma.incident.create({
      data: {
        facilityId: facility.id,
        title: data.title,
        description: data.description,
        severity: data.severity,
        category: data.category,
        status: 'DETECTED',
      },
    });
  }
}
