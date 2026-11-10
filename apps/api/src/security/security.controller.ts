import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { SecurityService } from './security.service';

@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('threats')
  async getAllThreats() {
    return this.securityService.getAllThreats();
  }

  @Get('stats')
  async getStats() {
    return this.securityService.getStats();
  }

  @Get('threats/:id')
  async findOne(@Param('id') id: string) {
    return this.securityService.findOne(id);
  }

  @Patch('threats/:id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.securityService.updateStatus(id, status);
  }
}
