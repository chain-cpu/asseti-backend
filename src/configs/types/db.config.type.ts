import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BaseDataSourceOptions } from 'typeorm/data-source/BaseDataSourceOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export type DbConfigType = {
  /**
   * Get connection options
   * @return { TypeOrmModuleOptions | PostgresConnectionOptions }
   */
  getConnectionOptions(): Partial<TypeOrmModuleOptions> &
    Partial<PostgresConnectionOptions>;

  /**
   * Get entities options
   * @return { BaseDataSourceOptions }
   */
  getEntitiesOptions(): Partial<BaseDataSourceOptions>;

  /**
   * Get migration options
   * @return {TypeOrmModuleOptions}
   */
  getMigrationOptions(): Partial<TypeOrmModuleOptions>;
};
