import { Controller } from '@nestjs/common';

import { BaseController } from 'src/common/controller/base.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';

@Controller('orders')
export class OrderController extends BaseController<Order> {
  constructor(private readonly orderService: OrderService) {
    super(orderService);
  }
}
