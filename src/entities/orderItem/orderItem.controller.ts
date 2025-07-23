import { Controller } from '@nestjs/common';

import { BaseController } from 'src/common/controller/base.controller';
import { OrderItem } from './orderItem.entity';
import { OrderItemService } from './orderItem.service';

@Controller('orderItems')
export class OrderItemController extends BaseController<OrderItem> {
  constructor(private readonly orderItemService: OrderItemService) {
    super(orderItemService);
  }
}
