import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { IncidentsService } from './incidents.service';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  async findAll() {
    return this.incidentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.incidentsService.create(body);
  }

  @Post(':id/comments')
  async addComment(@Param('id') id: string, @Body() body: { comment: string; author: string }) {
    return this.incidentsService.addComment(id, body.comment, body.author);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.incidentsService.updateStatus(id, status);
  }
}
