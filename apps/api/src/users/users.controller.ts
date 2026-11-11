import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Get('roles')
  async getRoles() {
    return this.usersService.getRoles();
  }

  @Post('roles')
  async createRole(@Body() body: any) {
    return this.usersService.createRole(body);
  }

  @Get('permissions')
  async getPermissions() {
    return this.usersService.getPermissions();
  }

  @Put('roles/:id/permissions')
  async assignPermissions(@Param('id') id: string, @Body('permissionIds') permissionIds: string[]) {
    return this.usersService.assignPermissions(id, permissionIds);
  }
}
