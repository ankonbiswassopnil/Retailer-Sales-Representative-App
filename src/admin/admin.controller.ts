import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ────── REGION CRUD (example) ──────
  @Post('regions')
  createRegion(@Body() data: { name: string }) {
    return this.adminService.createRegion(data);
  }

  @Get('regions')
  getRegions() {
    return this.adminService.getRegions();
  }

  @Patch('regions/:id')
  updateRegion(@Param('id') id: string, @Body() data: { name?: string }) {
    return this.adminService.updateRegion(parseInt(id, 10), data);
  }

  @Delete('regions/:id')
  deleteRegion(@Param('id') id: string) {
    return this.adminService.deleteRegion(parseInt(id, 10));
  }

  // ────── BULK IMPORT ──────
  @Post('retailers/import')
  @UseInterceptors(FileInterceptor('file'))
  importRetailers(@UploadedFile() file: Express.Multer.File) {
    return this.adminService.importRetailers(file);
  }

  // ────── BULK ASSIGN ──────
  @Post('assignments/bulk')
  bulkAssign(@Body() data: { salesRepId: number; retailerIds: number[] }) {
    return this.adminService.bulkAssign(data.salesRepId, data.retailerIds);
  }

  @Post('assignments/unassign')
  bulkUnassign(@Body() data: { salesRepId: number; retailerIds: number[] }) {
    return this.adminService.bulkUnassign(data.salesRepId, data.retailerIds);
  }
}