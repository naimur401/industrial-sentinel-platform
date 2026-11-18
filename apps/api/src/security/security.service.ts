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

  async updateNotes(id: string, notes: string) {
    return this.prisma.threatEvent.update({
      where: { id },
      data: { description: notes },
    });
  }

  async getNetworkMonitoring() {
    // Simulated network traffic data
    const protocols = [
      { protocol: 'TCP', percentage: 65, connections: 1250 },
      { protocol: 'UDP', percentage: 25, connections: 480 },
      { protocol: 'ICMP', percentage: 5, connections: 95 },
      { protocol: 'Other', percentage: 5, connections: 96 },
    ];

    // Simulated suspicious activity
    const suspiciousActivity = [
      { source: '203.0.113.42', type: 'Port Scan', severity: 'HIGH', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { source: '192.168.1.105', type: 'SQL Injection Attempt', severity: 'CRITICAL', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
      { source: '10.0.0.22', type: 'Brute Force Login', severity: 'HIGH', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      { source: '198.51.100.7', type: 'Malware Traffic', severity: 'CRITICAL', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
      { source: '172.16.0.4', type: 'DDoS Attempt', severity: 'LOW', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
    ];

    // Simulated traffic over time (last 24h)
    const trafficHistory = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      return {
        time: hour.getHours() + ':00',
        inbound: 50 + Math.random() * 150,
        outbound: 30 + Math.random() * 100,
      };
    });

    return {
      summary: {
        totalConnections: 1921,
        activeConnections: 245,
        blockedRequests: 87,
        bandwidthUsage: 68.5,
      },
      protocols,
      suspiciousActivity,
      trafficHistory,
    };
  }
}
