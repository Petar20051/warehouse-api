import { Controller, Get, Req } from '@nestjs/common';

import { BaseController } from 'src/common/controller/base.controller';
import { Partner } from './partner.entity';
import { PartnerService } from './partner.service';
import { AuthRequest } from 'src/common/types/auth-request';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/user.static';

@Controller('partners')
export class PartnerController extends BaseController<Partner> {
  constructor(private readonly partnerService: PartnerService) {
    super(partnerService);
  }

  @Get('top-customer')
  @Roles(UserRole.VIEWER, UserRole.OPERATOR, UserRole.OWNER)
  async getTopCustomer(@Req() req: AuthRequest) {
    const result = await this.partnerService.getTopCustomerByOrders(
      req.user.companyId,
    );
    return result;
  }
}
