import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrderItem } from './orderItem.entity';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { AuthUser } from 'src/common/types/auth-user';
import { BaseService } from 'src/common/services/base.service';
import { CreateOrderItemShape, UpdateOrderItemShape } from './orderItem.static';

@Injectable()
export class OrderItemService extends BaseService<OrderItem> {
  constructor(
    @InjectRepository(OrderItem) repo: Repository<OrderItem>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    private readonly dataSource: DataSource,
  ) {
    super(repo);
  }

  override async createWithUserContext(
    dto: CreateOrderItemShape,
    user: AuthUser,
  ): Promise<OrderItem> {
    await this.runAllValidations(dto);

    const entity: Partial<OrderItem> = {
      ...dto,
      modifiedByUserId: user.userId,
    };
    return this.repo.save(this.repo.create(entity));
  }

  override async updateWithUserContext(
    id: string,
    dto: UpdateOrderItemShape,
    user: AuthUser,
  ): Promise<OrderItem | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new Error('Order item not found');

    const updated: Partial<OrderItem> = {
      ...existing,
      ...dto,
      modifiedByUserId: user.userId,
    };

    await this.runAllValidations(updated);
    Object.assign(existing, updated);
    return this.repo.save(existing);
  }

  private async runAllValidations(dto: Partial<CreateOrderItemShape>) {
    await this.validateWarehouseSupportsProductType(dto);
    await this.validateOrderProductCompanyMatch(dto);
    await this.validateShipmentStockAvailability(dto);
  }

  private async validateWarehouseSupportsProductType(
    dto: Partial<CreateOrderItemShape>,
  ) {
    if (!dto.orderId || !dto.productId) return;

    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId },
      relations: ['warehouse'],
    });
    if (!order) throw new BadRequestException('Order not found');
    if (!order.warehouse) throw new BadRequestException('Warehouse not found');

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });
    if (!product) throw new BadRequestException('Product not found');

    const warehouse = order.warehouse;
    if (warehouse.supportedType !== product.productType) {
      throw new BadRequestException(
        `Incompatible types: cannot store ${product.productType} product in ${warehouse.supportedType} warehouse`,
      );
    }
  }

  private async validateOrderProductCompanyMatch(
    dto: Partial<CreateOrderItemShape>,
  ) {
    if (!dto.orderId || !dto.productId) return;

    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId },
      relations: ['company'],
    });
    if (!order) throw new BadRequestException('Order not found');
    if (!order.company)
      throw new BadRequestException('Order company not found');

    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
      relations: ['company'],
    });
    if (!product) throw new BadRequestException('Product not found');
    if (!product.company)
      throw new BadRequestException('Product company not found');

    if (order.company.id !== product.company.id) {
      throw new BadRequestException(
        'Order and product must belong to the same company',
      );
    }
  }

  private async validateShipmentStockAvailability(
    dto: Partial<CreateOrderItemShape>,
  ) {
    if (!dto.orderId || !dto.productId || typeof dto.quantity !== 'number')
      return;

    const order = await this.orderRepo.findOne({
      where: { id: dto.orderId },
      relations: ['warehouse'],
    });
    if (!order) throw new BadRequestException('Order not found');
    if (!order.warehouse) throw new BadRequestException('Warehouse not found');

    if (order.orderType !== 'shipment') return;

    const orderItems = await this.repo
      .createQueryBuilder('orderItem')
      .innerJoinAndSelect('orderItem.order', 'order')
      .where('orderItem.productId = :productId', { productId: dto.productId })
      .andWhere('order.warehouseId = :warehouseId', {
        warehouseId: order.warehouse.id,
      })
      .andWhere('orderItem.deletedAt IS NULL')
      .andWhere('order.deletedAt IS NULL')
      .getMany();

    let availableStock = 0;
    for (const item of orderItems) {
      if (item.order.orderType === 'delivery') {
        availableStock += item.quantity;
      } else if (item.order.orderType === 'shipment') {
        availableStock -= item.quantity;
      }
    }

    if (availableStock < dto.quantity) {
      throw new BadRequestException(
        `Insufficient stock: Available ${availableStock}, Attempted shipment ${dto.quantity}`,
      );
    }
  }
}
