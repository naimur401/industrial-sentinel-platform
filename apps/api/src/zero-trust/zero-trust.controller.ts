import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ZeroTrustService } from './zero-trust.service';

@Controller('zero-trust')
export class ZeroTrustController {
  constructor(private readonly zeroTrustService: ZeroTrustService) {}

  @Get('policies')
  async getAllPolicies() {
    return this.zeroTrustService.getAllPolicies();
  }

  @Post('policies')
  async createPolicy(@Body() body: any) {
    return this.zeroTrustService.createPolicy(body);
  }

  @Patch('policies/:id/toggle')
  async togglePolicy(@Param('id') id: string) {
    return this.zeroTrustService.togglePolicy(id);
  }

  @Post('evaluate')
  async evaluateAccess(@Body() body: { userId: string; resource: string; action: string; riskScore: number }) {
    return this.zeroTrustService.evaluateAccess(body.userId, body.resource, body.action, body.riskScore);
  }

  @Get('decisions')
  async getDecisions() {
    return this.zeroTrustService.getDecisions();
  }

  @Get('decisions/stats')
  async getDecisionStats() {
    return this.zeroTrustService.getDecisionStats();
  }

  @Get('devices')
  async getAllDevices() {
    return this.zeroTrustService.getAllDevices();
  }

  @Post('devices')
  async createDevice(@Body() body: any) {
    return this.zeroTrustService.createDevice(body);
  }

  @Patch('devices/:id/trust')
  async updateDeviceTrust(@Param('id') id: string, @Body('trustStatus') trustStatus: string) {
    return this.zeroTrustService.updateDeviceTrust(id, trustStatus);
  }
}
