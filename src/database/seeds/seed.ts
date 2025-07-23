import 'reflect-metadata';
import { runSeeder } from 'typeorm-seeding';
import { AppDataSource } from '../data-source';
import CreateCompanySeed from './01-CreateCompanySeed';
import CreateUserSeed from './02-CreateUserSeed';
import CreatePartnerSeed from './03-CreatePartnerSeed';
import CreateWarehouseSeed from './04-CreateWarehouseSeed';
import CreateProductSeed from './05-CreateProductSeed';
import CreateOrderSeed from './06-CreateOrderSeed';
import CreateOrderItemSeed from './07-CreateOrderItemSeed';
import CreateInvoiceSeed from './08-CreateInvoiceItem';

async function seed() {
  await AppDataSource.initialize();

  await runSeeder(CreateCompanySeed);
  await runSeeder(CreateUserSeed);
  await runSeeder(CreatePartnerSeed);
  await runSeeder(CreateWarehouseSeed);
  await runSeeder(CreateProductSeed);
  await runSeeder(CreateOrderSeed);
  await runSeeder(CreateOrderItemSeed);
  await runSeeder(CreateInvoiceSeed);

  await AppDataSource.destroy();
  console.log('✅ Seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
