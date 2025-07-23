import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/services/base.service';
import { OrderItem } from './orderItem.entity';

@Injectable()
export class OrderItemService extends BaseService<OrderItem> {
  constructor(@InjectRepository(OrderItem) repo: Repository<OrderItem>) {
    super(repo);
  }
}
