import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
config();

interface SeederDataSourceOptions extends PostgresConnectionOptions {
  factories?: string[];
  seeds?: string[];
}

const dataSourceOptions: SeederDataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/src/database/migrations/*.js'],

  factories: ['dist/src/database/factories/**/*{.js,.ts}'],
  seeds: ['dist/src/database/seeds/**/*{.js,.ts}'],

  synchronize: false,
  logging: true,
};

export const AppDataSource = new DataSource(dataSourceOptions);
