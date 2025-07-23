import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/services/base.service';
import { Partner } from './partner.entity';
import { Order } from '../order/order.entity';
import { TopCustomerResult } from './partner.static';

@Injectable()
export class PartnerService extends BaseService<Partner> {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {
    super(partnerRepo);
  }

  async getTopCustomerByOrders(companyId: string): Promise<TopCustomerResult> {
    const result = await this.partnerRepo
      .createQueryBuilder('partner')
      .leftJoin('partner.orders', 'order')
      .select('partner.id', 'partnerId')
      .addSelect('partner.name', 'name')
      .addSelect('COUNT(order.id)', 'totalorders')
      .where('partner.companyId = :companyId', { companyId })
      .andWhere('order.deletedAt IS NULL')
      .groupBy('partner.id')
      .orderBy('totalOrders', 'DESC')
      .limit(1)
      .getRawOne<TopCustomerResult>();

    if (!result) {
      throw new Error('No top customer found');
    }

    return result;
  }
}
