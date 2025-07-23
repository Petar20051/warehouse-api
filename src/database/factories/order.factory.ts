import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { Order } from 'src/entities/order/order.entity';
import { Company } from 'src/entities/company/company.entity';
import { Partner } from 'src/entities/partner/partner.entity';
import { Warehouse } from 'src/entities/warehouse/warehouse.entity';

define(
  Order,
  (
    faker: typeof Faker,
    ctx?: { company: Company; warehouse: Warehouse; partner?: Partner },
  ) => {
    const order = new Order();
    order.company = ctx!.company;
    order.warehouse = ctx!.warehouse;
    if (ctx!.partner) order.partner = ctx!.partner;
    order.orderType = faker.random.arrayElement(['shipment', 'delivery']);
    order.notes = faker.lorem.sentence();
    order.date = faker.date.recent();
    return order;
  },
);
