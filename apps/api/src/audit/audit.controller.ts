import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  async getAllLogs() {
    return this.auditService.getAllLogs();
  }

  @Get('verify')
  async verifyIntegrity() {
    return this.auditService.verifyIntegrity();
  }

  @Post('logs')
  async createLog(@Body() body: { userId?: string; action: string; resource: string; details?: string }) {
    return this.auditService.createLog(body.userId || null, body.action, body.resource, body.details);
  }
}
