import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { Partner } from 'src/entities/partner/partner.entity';
import { Company } from 'src/entities/company/company.entity';

define(Partner, (faker: typeof Faker, ctx?: { company: Company }) => {
  const partner = new Partner();
  partner.company = ctx!.company;
  partner.name = faker.company.companyName();
  partner.type = faker.random.arrayElement(['customer', 'supplier']);
  partner.email = faker.internet.email();
  partner.phone = faker.phone.phoneNumber();
  partner.address = faker.address.streetAddress();
  return partner;
});
