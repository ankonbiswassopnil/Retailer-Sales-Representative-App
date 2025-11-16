import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import csvParser from 'csv-parser';               // ← default import
import { Readable } from 'stream';

interface CsvRow {
  uid: string;
  name: string;
  phone?: string;
  regionId?: string;
  areaId?: string;
  distributorId?: string;
  territoryId?: string;
  points?: string;
  routes?: string;
  notes?: string;
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ────── REGION CRUD (example) ──────
  async createRegion(data: { name: string }) {
    return this.prisma.region.create({ data });
  }

  async getRegions() {
    return this.prisma.region.findMany();
  }

  async updateRegion(id: number, data: { name?: string }) {
    return this.prisma.region.update({ where: { id }, data });
  }

  async deleteRegion(id: number) {
    return this.prisma.region.delete({ where: { id } });
  }

  // ────── BULK IMPORT ──────
  async importRetailers(file: Express.Multer.File) {
    const rows: CsvRow[] = [];
    const stream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())                     // ← call the default export
        .on('data', (row: CsvRow) => rows.push(row))
        .on('end', async () => {
          try {
            const created = await this.prisma.retailer.createMany({
              data: rows.map(r => ({
                uid: r.uid,
                name: r.name,
                phone: r.phone ?? null,
                regionId: r.regionId ? Number(r.regionId) : null,
                areaId: r.areaId ? Number(r.areaId) : null,
                distributorId: r.distributorId ? Number(r.distributorId) : null,
                territoryId: r.territoryId ? Number(r.territoryId) : null,
                points: r.points ? Number(r.points) : 0,
                routes: r.routes ?? null,
                notes: r.notes ?? null,
              })),
              skipDuplicates: true,
            });
            resolve({ count: created.count });
          } catch (e) {
            reject(e);
          }
        })
        .on('error', reject);
    });
  }

  // ────── BULK ASSIGN ──────
  async bulkAssign(salesRepId: number, retailerIds: number[]) {
    return this.prisma.salesRepRetailer.createMany({
      data: retailerIds.map(id => ({ salesRepId, retailerId: id })),
      skipDuplicates: true,
    });
  }

  async bulkUnassign(salesRepId: number, retailerIds: number[]) {
    return this.prisma.salesRepRetailer.deleteMany({
      where: { salesRepId, retailerId: { in: retailerIds } },
    });
  }
}