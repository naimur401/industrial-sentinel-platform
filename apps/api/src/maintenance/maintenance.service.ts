import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const orders = await this.prisma.maintenanceOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Manually fetch asset for each order
    const ordersWithAssets = await Promise.all(
      orders.map(async (order) => {
        const asset = await this.prisma.asset.findUnique({
          where: { id: order.assetId },
        });
        return { ...order, asset };
      })
    );

    return ordersWithAssets;
  }

  async getStats() {
    const total = await this.prisma.maintenanceOrder.count();
    const open = await this.prisma.maintenanceOrder.count({ where: { status: 'OPEN' } });
    const inProgress = await this.prisma.maintenanceOrder.count({ where: { status: 'IN_PROGRESS' } });
    const completed = await this.prisma.maintenanceOrder.count({ where: { status: 'COMPLETED' } });
    return { total, open, inProgress, completed };
  }

  async create(data: any) {
    return this.prisma.maintenanceOrder.create({
      data: {
        assetId: data.assetId,
        title: data.title,
        description: data.description,
        status: 'OPEN',
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assignedTo: data.assignedTo,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    const updateData: any = { status };
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }
    return this.prisma.maintenanceOrder.update({
      where: { id },
      data: updateData,
    });
  }
}
