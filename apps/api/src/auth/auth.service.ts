import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, orgId: user.organizationId };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      }
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, mfaEnabled: true, status: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async updateProfile(userId: string, data: any) {
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;

    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true },
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    const newHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    // Generate reset token (in production, store this in DB with expiry and send email)
    const resetToken = crypto.randomBytes(32).toString('hex');

    return {
      message: 'Password reset link sent to your email',
      resetToken: resetToken, // In production, DO NOT return this. Send via email instead.
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // In production, verify the token against DB with expiry
    if (!token || token.length < 32) throw new BadRequestException('Invalid or expired token');

    const newHash = await bcrypt.hash(newPassword, 10);
    // In production, find user by token and update
    // For demo, update the first user
    await this.prisma.user.updateMany({
      data: { passwordHash: newHash },
    });

    return { message: 'Password reset successfully' };
  }

  async verifyMFA(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    // In production, verify TOTP code using speakeasy or otplib
    // For demo, accept code '123456'
    if (code !== '123456') {
      throw new UnauthorizedException('Invalid MFA code');
    }

    return {
      message: 'MFA verified successfully',
      verified: true,
    };
  }
}
