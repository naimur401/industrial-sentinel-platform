import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('summary')
  async getSummary() {
    return this.reportsService.getSummary();
  }

  @Get('assets')
  async getAssetReport() {
    return this.reportsService.getAssetReport();
  }

  @Get('incidents')
  async getIncidentReport() {
    return this.reportsService.getIncidentReport();
  }

  @Get('security')
  async getSecurityReport() {
    return this.reportsService.getSecurityReport();
  }

  @Get('infrastructure')
  async getInfrastructureReport() {
    return this.reportsService.getInfrastructureReport();
  }
}
