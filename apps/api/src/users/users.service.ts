import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => {
      const { passwordHash, ...rest } = user;
      return rest;
    });
  }

  async create(data: any) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const org = await this.prisma.organization.findFirst();
    if (!org) throw new Error('No organization found');

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        organizationId: org.id,
        name: data.name,
        email: data.email,
        passwordHash: passwordHash,
        status: 'ACTIVE',
      },
    });

    if (data.roleId) {
      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: data.roleId,
        },
      });
    }

    const { passwordHash: _, ...result } = user;
    return result;
  }

  async getRoles() {
    return this.prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            userRoles: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createRole(data: any) {
    const org = await this.prisma.organization.findFirst();
    if (!org) throw new Error('No organization found');

    const role = await this.prisma.role.create({
      data: {
        organizationId: org.id,
        name: data.name,
        isSystem: false,
      },
    });

    return role;
  }

  async getPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    await this.prisma.rolePermission.deleteMany({ where: { roleId } });

    for (const permissionId of permissionIds) {
      await this.prisma.rolePermission.create({
        data: { roleId, permissionId },
      });
    }

    return { message: 'Permissions updated successfully' };
  }
}
