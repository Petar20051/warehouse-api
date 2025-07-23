import { Factory, Seeder } from 'typeorm-seeding';
import { Company } from 'src/entities/company/company.entity';

export default class CreateCompanySeed implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Company)().createMany(2);
  }
}
