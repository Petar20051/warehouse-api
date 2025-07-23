import { Controller, Get, Req } from '@nestjs/common';

import { BaseController } from 'src/common/controller/base.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from '../user/user.static';
import { AuthRequest } from 'src/common/types/auth-request';

@Controller('products')
export class ProductController extends BaseController<Product> {
  constructor(private readonly productService: ProductService) {
    super(productService);
  }
  @Get('best-selling')
  @Roles(UserRole.VIEWER, UserRole.OPERATOR, UserRole.OWNER)
  getBestSelling(@Req() req: AuthRequest) {
    return this.productService.getBestSellingProducts(req.user.companyId);
  }
}
