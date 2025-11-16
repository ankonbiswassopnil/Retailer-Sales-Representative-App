import { Controller, Get, Query, UseGuards, Patch, Param, Body } from '@nestjs/common';
import { RetailersService } from './retailers.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { GetUser } from '../auth/get-user.decorator';

@Controller('retailers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('SALES_REP')
export class RetailersController {
  constructor(private retailersService: RetailersService) {}

  @Get()
  getAssigned(
    @GetUser() user,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search: string,
    @Query('regionId') regionId: number,
    @Query('areaId') areaId: number,
    @Query('distributorId') distributorId: number,
    @Query('territoryId') territoryId: number,
  ) {
    return this.retailersService.getAssignedRetailers(
      user.userId,
      +page,
      +limit,
      search,
      { regionId, areaId, distributorId, territoryId },
    );
  }

  @Get(':uid')
  getDetail(@GetUser() user, @Param('uid') uid: string) {
    return this.retailersService.getRetailerDetail(user.userId, uid);
  }

  @Patch(':uid')
  update(@GetUser() user, @Param('uid') uid: string, @Body() data: any) {
    return this.retailersService.updateRetailer(user.userId, uid, data);
  }
}