import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async findAll() {
    return this.assetsService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.assetsService.getStats();
  }

  @Get('criticality-distribution')
  async getCriticalityDistribution() {
    return this.assetsService.getCriticalityDistribution();
  }

  @Get('recent-activity')
  async getRecentActivity() {
    return this.assetsService.getRecentActivity();
  }

  @Get('ai-risk-summary')
  async getAIRiskSummary() {
    return this.assetsService.getAIRiskSummary();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.assetsService.create(body);
  }
}
