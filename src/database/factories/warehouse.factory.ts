import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { Warehouse } from 'src/entities/warehouse/warehouse.entity';
import { Company } from 'src/entities/company/company.entity';

define(Warehouse, (faker: typeof Faker, ctx?: { company: Company }) => {
  const warehouse = new Warehouse();
  warehouse.company = ctx!.company;
  warehouse.name = `${ctx!.company.name} ${faker.address.city()} Depot`;
  warehouse.location = faker.address.streetAddress();
  warehouse.supportedType = faker.random.arrayElement(['solid', 'liquid']);
  return warehouse;
});
