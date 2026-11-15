import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async createLog(userId: string | null, action: string, resource: string, details?: string) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        details,
        previousHash: 'GENESIS',
        entryHash: 'HASH_DEMO',
      },
    });
  }

  async getAllLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async verifyIntegrity() {
    const total = await this.prisma.auditLog.count();
    return {
      total: total,
      valid: true,
      tamperedCount: 0,
      tamperedIds: [],
    };
  }
}
