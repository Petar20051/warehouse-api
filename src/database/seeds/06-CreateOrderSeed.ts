import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import * as Faker from 'faker';
import { Company } from 'src/entities/company/company.entity';
import { Warehouse } from 'src/entities/warehouse/warehouse.entity';
import { Partner } from 'src/entities/partner/partner.entity';
import { Order } from 'src/entities/order/order.entity';

export default class CreateOrderSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const faker = Faker;
    const companies = await dataSource.getRepository(Company).find();
    for (const company of companies) {
      const warehouses = await dataSource
        .getRepository(Warehouse)
        .find({ where: { company } });
      const partners = await dataSource
        .getRepository(Partner)
        .find({ where: { company } });
      for (let i = 0; i < 5; i++) {
        const warehouse = faker.random.arrayElement(warehouses);
        const partner = faker.random.arrayElement(partners);
        await factory(Order)({ company, warehouse, partner }).create();
      }
    }
  }
}
