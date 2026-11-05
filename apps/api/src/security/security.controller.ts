import { Controller, Get } from '@nestjs/common';
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
}
