import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ModelsService } from './models.service';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  async findAll() {
    return this.modelsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.modelsService.findOne(id);
  }

  @Post()
  async create(@Body() body: any) {
    return this.modelsService.create(body);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.modelsService.updateStatus(id, status);
  }
}
