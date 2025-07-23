import { Controller, Get, Req } from '@nestjs/common';

import { BaseController } from 'src/common/controller/base.controller';
import { Warehouse } from './warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/user.static';
import { AuthRequest } from 'src/common/types/auth-request';

@Controller('warehouses')
export class WarehouseController extends BaseController<Warehouse> {
  constructor(private readonly warehouseService: WarehouseService) {
    super(warehouseService);
  }

  @Get('highest-stock')
  @Roles(UserRole.VIEWER, UserRole.OPERATOR, UserRole.OWNER)
  getHighestStock(@Req() req: AuthRequest) {
    return this.warehouseService.getProductWithHighestStock(req.user.companyId);
  }
}
