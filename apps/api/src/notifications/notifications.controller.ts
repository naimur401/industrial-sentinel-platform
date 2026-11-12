import { Controller, Get, Post, Patch, Param, Body, Req, UnauthorizedException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  private getUserId(req: any): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token');
    const token = authHeader.split(' ')[1];
    const decoded: any = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return decoded.sub;
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.notificationsService.findAll(userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: any) {
    const userId = this.getUserId(req);
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.notificationsService.markAllAsRead(userId);
  }

  @Post()
  async create(@Body() body: any) {
    return this.notificationsService.create(body);
  }
}
