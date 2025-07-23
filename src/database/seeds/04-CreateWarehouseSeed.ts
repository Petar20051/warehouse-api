import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Company } from 'src/entities/company/company.entity';
import { Warehouse } from 'src/entities/warehouse/warehouse.entity';

export default class CreateWarehouseSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const companies = await dataSource.getRepository(Company).find();
    for (const company of companies) {
      await factory(Warehouse)({ company }).createMany(2);
    }
  }
}
