import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import dbConfig from './db.config';

dotenv.config({
  path: process.env.DOTENV_CONFIG_PATH || '.env',
  debug: process.env.DOTENV_CONFIG_DEBUG === 'true',
  override: process.env.DOTENV_CONFIG_OVERRIDE === 'true',
});

const connectionOptions = dbConfig().getConnectionOptions();
const entitiesOptions = dbConfig().getEntitiesOptions();
const migrationOptions = dbConfig().getMigrationOptions();

export const dataSource = new DataSource({
  type: connectionOptions.type,
  host: connectionOptions.host,
  port: connectionOptions.port,
  username: connectionOptions.username,
  password: connectionOptions.password,
  database: connectionOptions.database,
  entities: entitiesOptions.entities,
  migrations: migrationOptions.migrations,
  migrationsTableName: migrationOptions.migrationsTableName,
  migrationsTransactionMode: migrationOptions.migrationsTransactionMode,
  synchronize: migrationOptions.synchronize,
  dropSchema: migrationOptions.dropSchema,
});
