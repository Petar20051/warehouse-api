import { Factory, Seeder } from 'typeorm-seeding';
import { DataSource } from 'typeorm';
import { Company } from 'src/entities/company/company.entity';
import { Product } from 'src/entities/product/product.entity';

export default class CreateProductSeed implements Seeder {
  public async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const companies = await dataSource.getRepository(Company).find();
    for (const company of companies) {
      await factory(Product)({ company }).createMany(5);
    }
  }
}
