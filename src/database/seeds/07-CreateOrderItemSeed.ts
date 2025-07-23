import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import * as Faker from 'faker';
import { Order } from 'src/entities/order/order.entity';
import { Product } from 'src/entities/product/product.entity';
import { OrderItem } from 'src/entities/orderItem/orderItem.entity';

export default class CreateOrderItemSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const faker = Faker;
    const orders = await dataSource.getRepository(Order).find();
    const products = await dataSource.getRepository(Product).find();
    for (const order of orders) {
      for (let i = 0; i < 3; i++) {
        const product = faker.random.arrayElement(products);
        await factory(OrderItem)({ order, product }).create();
      }
    }
  }
}
