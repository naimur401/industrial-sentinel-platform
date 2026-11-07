import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SensorsService } from './sensors.service';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Get()
  async findAll() {
    return this.sensorsService.findAll();
  }

  @Get('anomalies')
  async getAnomalies() {
    return this.sensorsService.getAnomalies();
  }

  @Post('detect')
  async detectAnomaly(@Body() body: { sensorId: string; value: number }) {
    return this.sensorsService.detectAndSaveAnomaly(body.sensorId, body.value);
  }

  @Get(':id/readings')
  async getReadings(@Param('id') id: string) {
    return this.sensorsService.getReadings(id);
  }
}
