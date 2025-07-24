import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Company } from '../entities/company/company.entity';
import { User } from '../entities/user/user.entity';
import { Partner } from '../entities/partner/partner.entity';
import { Warehouse } from '../entities/warehouse/warehouse.entity';
import { Product } from '../entities/product/product.entity';
import { Order } from '../entities/order/order.entity';
import { OrderItem } from '../entities/orderItem/orderItem.entity';
import { Invoice } from '../entities/invoice/invoice.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: [
    Company,
    User,
    Partner,
    Warehouse,
    Product,
    Order,
    OrderItem,
    Invoice,
  ],

  migrations: ['src/database/migrations/**/*.ts'],
  migrationsRun: true,
  synchronize: false,
  logging: true,
});
