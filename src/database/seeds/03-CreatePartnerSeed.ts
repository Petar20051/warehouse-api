import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Company } from 'src/entities/company/company.entity';
import { Partner } from 'src/entities/partner/partner.entity';

export default class CreatePartnerSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const companies = await dataSource.getRepository(Company).find();
    for (const company of companies) {
      await factory(Partner)({ company }).createMany(2);
    }
  }
}
