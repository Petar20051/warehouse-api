import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { User } from 'src/entities/user/user.entity';
import { UserRole } from 'src/entities/user/user.static';
import { Company } from 'src/entities/company/company.entity';

define(User, (faker: typeof Faker, ctx?: { company: Company }) => {
  const user = new User();
  user.company = ctx!.company;
  user.fullName = faker.name.findName();
  user.email = faker.internet.email();
  user.password = faker.internet.password();
  user.role = faker.random.arrayElement(Object.values(UserRole));
  return user;
});
