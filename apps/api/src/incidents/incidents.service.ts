import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: { facility: true },
    });

    if (!incident) throw new NotFoundException('Incident not found');

    const events = await this.prisma.incidentEvent.findMany({
      where: { incidentId: id },
      orderBy: { createdAt: 'desc' },
    });

    return { ...incident, events };
  }

  async create(data: any) {
    const facility = await this.prisma.facility.findFirst();
    if (!facility) throw new Error('No facility found');

    const incident = await this.prisma.incident.create({
      data: {
        facilityId: facility.id,
        title: data.title,
        description: data.description,
        severity: data.severity,
        category: data.category,
        status: 'DETECTED',
      },
    });

    await this.prisma.incidentEvent.create({
      data: {
        incidentId: incident.id,
        eventType: 'CREATED',
        description: 'Incident created',
      },
    });

    return incident;
  }

  async addComment(id: string, comment: string, author: string) {
    return this.prisma.incidentEvent.create({
      data: {
        incidentId: id,
        eventType: 'COMMENT',
        description: author + ': ' + comment,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    const incident = await this.prisma.incident.update({
      where: { id },
      data: { status: status as any },
    });

    await this.prisma.incidentEvent.create({
      data: {
        incidentId: id,
        eventType: 'STATUS_CHANGE',
        description: 'Status changed to ' + status,
      },
    });

    return incident;
  }
}
