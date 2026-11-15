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

    const accessDecision = await this.prisma.accessDecision.create({
      data: {
        userId,
        resource,
        action,
        riskScore,
        decision,
        reason: 'Risk score based on role, device, location, and time',
      },
    });

    return accessDecision;
  }

  async getDecisions() {
    return this.prisma.accessDecision.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
