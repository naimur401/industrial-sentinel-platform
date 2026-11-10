import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService) {}

  async getAllThreats() {
    return this.prisma.threatEvent.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats() {
    const totalThreats = await this.prisma.threatEvent.count();
    const criticalThreats = await this.prisma.threatEvent.count({ where: { severity: 'CRITICAL' } });
    const activeThreats = await this.prisma.threatEvent.count({ where: { status: 'NEW' } });
    return { totalThreats, criticalThreats, activeThreats };
  }

  async findOne(id: string) {
    const threat = await this.prisma.threatEvent.findUnique({ where: { id } });
    if (!threat) throw new NotFoundException('Threat not found');
    return threat;
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.threatEvent.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
