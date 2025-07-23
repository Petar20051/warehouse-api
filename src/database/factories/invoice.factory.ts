import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { Invoice, InvoiceStatus } from 'src/entities/invoice/invoice.entity';
import { Order } from 'src/entities/order/order.entity';

define(Invoice, (faker: typeof Faker, ctx?: { order: Order }) => {
  const invoice = new Invoice();
  invoice.invoiceNumber = `INV-${faker.datatype.uuid().slice(0, 8)}`;
  invoice.order = ctx!.order;
  invoice.status = faker.random.arrayElement(Object.values(InvoiceStatus));
  invoice.date = faker.date.recent();
  return invoice;
});
