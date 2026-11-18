import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InfrastructureService {
  constructor(private prisma: PrismaService) {}

  async getAllServers() {
    return this.prisma.server.findMany({
      orderBy: { hostname: 'asc' },
    });
  }

  async getServerStats() {
    const total = await this.prisma.server.count();
    const online = await this.prisma.server.count({ where: { status: 'ONLINE' } });
    const degraded = await this.prisma.server.count({ where: { status: 'DEGRADED' } });
    const offline = await this.prisma.server.count({ where: { status: 'OFFLINE' } });
    return { total, online, degraded, offline };
  }

  async getServerDetails(id: string) {
    const server = await this.prisma.server.findUnique({ where: { id } });
    if (!server) throw new NotFoundException('Server not found');

    const metrics = await this.prisma.serverMetric.findMany({
      where: { serverId: id },
      orderBy: { timestamp: 'desc' },
      take: 24,
    });

    return { ...server, metrics: metrics.reverse() };
  }

  async createServer(data: any) {
    const facility = await this.prisma.facility.findFirst();
    if (!facility) throw new Error('No facility found');

    return this.prisma.server.create({
      data: {
        facilityId: facility.id,
        hostname: data.hostname,
        ipAddress: data.ipAddress,
        os: data.os,
        environment: data.environment || 'production',
        status: data.status || 'ONLINE',
      },
    });
  }

  async getNetworkHealth() {
    // Aggregate network metrics from all servers
    const servers = await this.prisma.server.findMany();

    // Simulated network health data based on server metrics
    const totalServers = servers.length;
    const onlineServers = servers.filter(s => s.status === 'ONLINE').length;
    const degradedServers = servers.filter(s => s.status === 'DEGRADED').length;
    const offlineServers = servers.filter(s => s.status === 'OFFLINE').length;

    // Network stats (simulated)
    const avgBandwidth = 850 + Math.random() * 200;
    const avgLatency = 12 + Math.random() * 8;
    const packetLoss = Math.random() * 2;
    const uptime = ((onlineServers / totalServers) * 100).toFixed(2);

    // Interface status
    const interfaces = servers.map(s => ({
      server: s.hostname,
      ip: s.ipAddress,
      status: s.status === 'ONLINE' ? 'UP' : s.status === 'DEGRADED' ? 'DEGRADED' : 'DOWN',
      bandwidth: (100 + Math.random() * 900).toFixed(1),
      latency: (10 + Math.random() * 20).toFixed(1),
      packetLoss: (Math.random() * 1.5).toFixed(2),
    }));

    return {
      summary: {
        avgBandwidth: avgBandwidth.toFixed(1),
        avgLatency: avgLatency.toFixed(1),
        packetLoss: packetLoss.toFixed(2),
        uptime: uptime,
        totalServers,
        onlineServers,
        degradedServers,
        offlineServers,
      },
      interfaces,
    };
  }

  async getSystemLogs() {
    const logs = [
      { service: 'auth-service', severity: 'INFO', message: 'User login successful for super@sentinel.local' },
      { service: 'asset-service', severity: 'INFO', message: 'Asset PUMP-001 updated by user' },
      { service: 'db-primary', severity: 'WARN', message: 'Slow query detected (2.3s) on assets table' },
      { service: 'ai-engine', severity: 'INFO', message: 'RUL prediction generated for COMPRESSOR-0030' },
      { service: 'api-gateway', severity: 'ERROR', message: 'Connection timeout to upstream service' },
      { service: 'auth-service', severity: 'WARN', message: 'Failed login attempt from 203.0.113.42' },
      { service: 'web-prod-01', severity: 'INFO', message: 'Nginx access log: GET /api/v1/assets 200' },
      { service: 'db-primary', severity: 'INFO', message: 'Database backup completed successfully' },
      { service: 'ai-engine', severity: 'ERROR', message: 'Model inference failed: NaN value in features' },
      { service: 'monitoring', severity: 'INFO', message: 'Prometheus scrape completed for 8 targets' },
      { service: 'security-engine', severity: 'CRITICAL', message: 'Intrusion detected: SQL injection attempt blocked' },
      { service: 'api-gateway', severity: 'WARN', message: 'Rate limit exceeded for IP 192.168.1.105' },
      { service: 'web-prod-02', severity: 'INFO', message: 'SSL certificate renewed successfully' },
      { service: 'db-replica', severity: 'WARN', message: 'Replication lag detected: 5.2s behind primary' },
      { service: 'ai-engine', severity: 'INFO', message: 'Anomaly detection completed for 3 sensors' },
    ];
    return logs.map((log, i) => {
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - (i * 8));
      return {
        id: 'log-' + (i + 1),
        ...log,
        timestamp: timestamp.toISOString(),
      };
    });
  }
}
