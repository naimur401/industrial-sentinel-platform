import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { InfrastructureService } from './infrastructure.service';

@Controller('infrastructure')
export class InfrastructureController {
  constructor(private readonly infrastructureService: InfrastructureService) {}

  @Get('servers')
  async getAllServers() {
    return this.infrastructureService.getAllServers();
  }

  @Get('servers/stats')
  async getServerStats() {
    return this.infrastructureService.getServerStats();
  }

  @Get('servers/:id')
  async getServerDetails(@Param('id') id: string) {
    return this.infrastructureService.getServerDetails(id);
  }

  @Post('servers')
  async createServer(@Body() body: any) {
    return this.infrastructureService.createServer(body);
  }

  @Get('network-health')
  async getNetworkHealth() {
    return this.infrastructureService.getNetworkHealth();
  }

  @Get('system-logs')
  async getSystemLogs() {
    return this.infrastructureService.getSystemLogs();
  }
}
