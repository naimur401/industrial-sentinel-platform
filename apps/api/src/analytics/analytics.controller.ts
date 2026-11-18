import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('asset-health')
  async getAssetHealthTrend() {
    return this.analyticsService.getAssetHealthTrend();
  }

  @Get('incident-stats')
  async getIncidentStats() {
    return this.analyticsService.getIncidentStats();
  }

  @Get('threat-trend')
  async getThreatTrend() {
    return this.analyticsService.getThreatTrend();
  }

  @Get('maintenance-costs')
  async getMaintenanceCosts() {
    return this.analyticsService.getMaintenanceCosts();
  }
}
