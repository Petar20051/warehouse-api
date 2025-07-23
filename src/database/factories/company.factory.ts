import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { Company } from 'src/entities/company/company.entity';

define(Company, (faker: typeof Faker) => {
  const company = new Company();
  company.name = faker.company.companyName();
  company.email = faker.internet.email();
  return company;
});
