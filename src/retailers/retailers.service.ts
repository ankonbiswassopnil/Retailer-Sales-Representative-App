import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RetailersService {
  constructor(private prisma: PrismaService) {}

  async getAssignedRetailers(
    userId: number,
    page: number,
    limit: number,
    search?: string,
    filters?: any,
  ) {
    const where: any = {
      assignments: { some: { salesRepId: userId } },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { uid: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filters?.regionId) where.regionId = filters.regionId;
    if (filters?.areaId) where.areaId = filters.areaId;

    const [retailers, total] = await Promise.all([
      this.prisma.retailer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { region: true, area: true },
      }),
      this.prisma.retailer.count({ where }),
    ]);

    return { retailers, total, page, limit };
  }

  async getRetailerDetail(userId: number, uid: string) {
    const retailer = await this.prisma.retailer.findUnique({
      where: { uid },
      include: { region: true, area: true },
    });

    if (!retailer) throw new NotFoundException();

    const assigned = await this.prisma.salesRepRetailer.findUnique({
      where: { salesRepId_retailerId: { salesRepId: userId, retailerId: retailer.id } },
    });

    if (!assigned) throw new UnauthorizedException();
    return retailer;
  }

  async updateRetailer(userId: number, uid: string, data: any) {
    const retailer = await this.getRetailerDetail(userId, uid);
    return this.prisma.retailer.update({
      where: { id: retailer.id },
      data: { ...data, updatedAt: new Date() },
    });
  }
}