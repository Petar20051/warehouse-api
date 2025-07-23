import { define } from 'typeorm-seeding';
import * as Faker from 'faker';
import { Product } from 'src/entities/product/product.entity';
import { Company } from 'src/entities/company/company.entity';

define(Product, (faker: typeof Faker, ctx?: { company: Company }) => {
  const product = new Product();
  product.company = ctx!.company;
  product.name = faker.commerce.productName();
  product.sku = faker.random.alphaNumeric(8).toUpperCase();
  product.productType = faker.random.arrayElement(['solid', 'liquid']);
  product.description = faker.lorem.sentence();
  product.basePrice = parseFloat(faker.commerce.price(1, 1000, 2));
  return product;
});
