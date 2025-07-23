/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment */
import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { OrderItem } from 'src/entities/orderItem/orderItem.entity';
import { Order } from 'src/entities/order/order.entity';
import { Product } from 'src/entities/product/product.entity';

define(
  OrderItem,
  (faker: typeof Faker, ctx?: { order: Order; product: Product }) => {
    const item = new OrderItem();
    item.order = ctx!.order;
    item.product = ctx!.product;
    item.unitPrice = ctx!.product.basePrice;
    item.quantity = (faker.datatype.number as any)({ min: 1, max: 20 });
    return item;
  },
);
