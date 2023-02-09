import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BaseDataSourceOptions } from 'typeorm/data-source/BaseDataSourceOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DbConfigType } from './types/db.config.type';
import { getEnv } from '../utils/get-env.variable.util';

export default registerAs(
  'db',
  (): DbConfigType => ({
    /**
     * Get entities options
     * @return { BaseDataSourceOptions }
     */
    getEntitiesOptions: (): Partial<BaseDataSourceOptions> => ({
      entities: [getEnv('POSTGRES_DB_MIGRATIONS_ENTITIES', true)],
    }),

    /**
     * Get connection options
     * @return {TypeOrmModuleOptions | PostgresConnectionOptions}
     */
    getConnectionOptions: (): Partial<TypeOrmModuleOptions> &
      Partial<PostgresConnectionOptions> => ({
      type: getEnv('DB_TYPE', true) as any,
      host: getEnv('POSTGRES_HOST', true),
      port: parseInt(getEnv('POSTGRES_PORT', false)) || 5432,
      username: getEnv('POSTGRES_USER', true),
      password: getEnv('POSTGRES_PASSWORD', true),
      database: getEnv('POSTGRES_DB', true),
      logging: getEnv('POSTGRES_DB_LOGGING', true) as any,
      maxQueryExecutionTime: parseInt(
        getEnv('POSTGRES_DB_LOG_SLOW_QUERIES_SEC', true),
      ),
      useUTC: true,
      connectTimeoutMS: parseInt(
        getEnv('POSTGRES_DB_CONNECTION_TIMEOUT_MS', true),
      ),
      logNotifications:
        getEnv('POSTGRES_DB_LOG_ENGINE_NOTIFICATIONS', true) === 'true',
      uuidExtension: 'uuid-ossp',
      applicationName: getEnv('NODE_ENV', false),
      ssl: getEnv('POSTGRES_DB_SSL', true) === 'true',
      verboseRetryLog: true,
    }),

    /**
     * Get migration options
     * @return {TypeOrmModuleOptions}
     */
    getMigrationOptions: (): Partial<TypeOrmModuleOptions> => ({
      migrationsTableName:
        getEnv('POSTGRES_DB_MIGRATIONS_TABLE_NAME', false) || 'migrations',
      migrationsRun:
        getEnv('POSTGRES_DB_RUN_MIGRATION_ON_STARTUP', false) === 'true',
      migrations: [getEnv('POSTGRES_DB_MIGRATIONS', true)],
      synchronize: getEnv('POSTGRES_DB_SYNCHRONIZE', false) === 'true',
      migrationsTransactionMode: getEnv(
        'POSTGRES_DB_MIGRATIONS_TRANSACTION_MODE',
        true,
      ) as any,
      dropSchema: getEnv('POSTGRES_DB_DROP_SCHEMA', false) === 'true',
    }),
  }),
);
