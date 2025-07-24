import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { BaseService } from 'src/common/services/base.service';
import { InvoiceService } from '../invoice/invoice.service';
import { AuthUser } from 'src/common/types/auth-user';
import { CreateOrderDto } from './order.static';
import { InvoiceStatus } from '../invoice/invoice.entity';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    repo: Repository<Order>,
    private readonly invoiceService: InvoiceService,
  ) {
    super(repo);
  }

  override async createWithUserContext(
    dto: CreateOrderDto,
    user: AuthUser,
  ): Promise<Order> {
    const created = await super.createWithUserContext(dto, user);

    const order = await this.repo.findOne({
      where: { id: created.id },
      relations: ['partner'],
    });
    if (!order) throw new Error('Order not found after creation');

    const shouldCreateInvoice =
      order.partner?.id && order.orderType === 'shipment';

    if (shouldCreateInvoice) {
      await this.invoiceService.createWithUserContext(
        {
          order: { id: order.id },
          status: InvoiceStatus.UNPAID,
        },
        user,
      );
    }

    return order;
  }
}
