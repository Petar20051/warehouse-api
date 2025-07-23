import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Company } from 'src/entities/company/company.entity';
import { User } from 'src/entities/user/user.entity';

export default class CreateUserSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const companies = await dataSource.getRepository(Company).find();
    for (const company of companies) {
      await factory(User)({ company }).createMany(3);
    }
  }
}
