import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ZeroTrustService {
  constructor(private prisma: PrismaService) {}

  async getAllPolicies() {
    return this.prisma.accessPolicy.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPolicy(data: any) {
    return this.prisma.accessPolicy.create({
      data: {
        name: data.name,
        description: data.description,
        resource: data.resource,
        action: data.action,
        conditions: data.conditions || {},
        enabled: true,
      },
    });
  }

  async togglePolicy(id: string) {
    const policy = await this.prisma.accessPolicy.findUnique({ where: { id } });
    if (!policy) throw new Error('Policy not found');

    return this.prisma.accessPolicy.update({
      where: { id },
      data: { enabled: !policy.enabled },
    });
  }

  async evaluateAccess(userId: string, resource: string, action: string, riskScore: number) {
    let decision = 'ALLOW';
    if (riskScore >= 80) decision = 'DENY';
    else if (riskScore >= 60) decision = 'REQUIRE_VERIFICATION';
    else if (riskScore >= 30) decision = 'REQUIRE_MFA';

    return this.prisma.accessDecision.create({
      data: {
        userId,
        resource,
        action,
        riskScore,
        decision,
        reason: 'Risk score based on role, device, location, and time',
      },
    });
  }

  async getDecisions() {
    return this.prisma.accessDecision.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getDecisionStats() {
    const total = await this.prisma.accessDecision.count();
    const allow = await this.prisma.accessDecision.count({ where: { decision: 'ALLOW' } });
    const deny = await this.prisma.accessDecision.count({ where: { decision: 'DENY' } });
    const requireMfa = await this.prisma.accessDecision.count({ where: { decision: 'REQUIRE_MFA' } });
    const requireVerification = await this.prisma.accessDecision.count({ where: { decision: 'REQUIRE_VERIFICATION' } });
    return { total, allow, deny, requireMfa, requireVerification };
  }

  async getAllDevices() {
    return this.prisma.device.findMany({
      orderBy: { lastActivity: 'desc' },
    });
  }

  async createDevice(data: any) {
    return this.prisma.device.create({
      data: {
        userId: data.userId,
        deviceFingerprint: data.deviceFingerprint,
        name: data.name,
        os: data.os,
        browser: data.browser,
        trustStatus: data.trustStatus || 'UNKNOWN',
      },
    });
  }

  async updateDeviceTrust(id: string, trustStatus: string) {
    return this.prisma.device.update({
      where: { id },
      data: { trustStatus: trustStatus as any, lastActivity: new Date() },
    });
  }
}
