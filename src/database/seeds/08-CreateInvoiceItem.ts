import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Order } from 'src/entities/order/order.entity';
import { Invoice } from 'src/entities/invoice/invoice.entity';

export default class CreateInvoiceSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const orders = await dataSource.getRepository(Order).find();
    for (const order of orders) {
      await factory(Invoice)({ order }).create();
    }
  }
}
