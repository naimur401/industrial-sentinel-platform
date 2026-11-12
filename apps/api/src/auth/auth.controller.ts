import { Controller, Post, Body, Get, Patch, UnauthorizedException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Get('profile/:userId')
  async getProfile(@Req() req: any) {
    // Get userId from Authorization header token
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token');
    const token = authHeader.split(' ')[1];
    const decoded: any = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return this.authService.getProfile(decoded.sub);
  }

  @Patch('profile/:userId')
  async updateProfile(@Body() body: any, @Req() req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token');
    const token = authHeader.split(' ')[1];
    const decoded: any = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return this.authService.updateProfile(decoded.sub, body);
  }

  @Patch('password')
  async changePassword(@Body() body: any, @Req() req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token');
    const token = authHeader.split(' ')[1];
    const decoded: any = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return this.authService.changePassword(decoded.sub, body.oldPassword, body.newPassword);
  }
}
