import { Controller, Get, Post, Body } from '@nestjs/common';
import { IncidentsService } from './incidents.service';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  async findAll() {
    return this.incidentsService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.incidentsService.create(body);
  }
}
