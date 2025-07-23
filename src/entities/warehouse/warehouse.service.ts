import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Warehouse } from './warehouse.entity';
import { OrderItem } from '../orderItem/orderItem.entity';
import { WarehouseTopStock } from './warehouse.static';

@Injectable()
export class WarehouseService extends BaseService<Warehouse> {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {
    super(warehouseRepo);
  }

  async getProductWithHighestStock(
    companyId: string,
  ): Promise<WarehouseTopStock[]> {
    return this.orderItemRepo
      .createQueryBuilder('orderitem')
      .innerJoin('orderitem.order', 'order')
      .innerJoin('orderitem.product', 'product')
      .innerJoin('order.warehouse', 'warehouse')
      .select('warehouse.id', 'warehouseId')
      .addSelect('warehouse.name', 'warehouseName')
      .addSelect('product.id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect(
        `SUM(
           CASE
             WHEN order.orderType = 'delivery' THEN orderitem.quantity
             WHEN order.orderType = 'shipment' THEN -orderitem.quantity
             ELSE 0
           END
         )`,
        'stock',
      )

      .where('order.companyId = :companyId', { companyId })

      .andWhere('warehouse.companyId = :companyId', { companyId })

      .andWhere('order.deletedAt IS NULL')
      .andWhere('orderitem.deletedAt IS NULL')
      .andWhere('product.deletedAt IS NULL')
      .andWhere('warehouse.deletedAt IS NULL')

      .groupBy('warehouse.id')
      .addGroupBy('warehouse.name')
      .addGroupBy('product.id')
      .addGroupBy('product.name')

      .orderBy('warehouse.name')
      .addOrderBy('stock', 'DESC')
      .getRawMany<WarehouseTopStock>();
  }
}
