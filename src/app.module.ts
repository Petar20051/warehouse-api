import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './entities/company/company.module';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from './auth/auth.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { WarehouseModule } from './entities/warehouse/warehouse.module';
import { ProductModule } from './entities/product/product.module';
import { PartnerModule } from './entities/partner/partner.module';
import { OrderModule } from './entities/order/order.module';
import { OrderItemModule } from './entities/orderItem/orderItem.module';
import { InvoiceModule } from './entities/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      migrations: ['src/database/migrations/**/*.ts'],
      migrationsRun: true,
      autoLoadEntities: true,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    AuthModule,
    CompanyModule,
    UserModule,
    WarehouseModule,
    ProductModule,
    PartnerModule,
    OrderModule,
    OrderItemModule,
    InvoiceModule,
  ],
})
export class AppModule {}
