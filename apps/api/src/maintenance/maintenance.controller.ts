import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  async findAll() {
    return this.maintenanceService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.maintenanceService.getStats();
  }

  @Post()
  async create(@Body() body: any) {
    return this.maintenanceService.create(body);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.maintenanceService.updateStatus(id, status);
  }
}
