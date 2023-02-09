import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from './api/accounts/account.module';
import { AssetModule } from './api/asset/asset.module';
import { AuthModule } from './api/auth/auth.module';
import { BankAccountModule } from './api/bank-accounts/bank-account.module';
import { CompanyModule } from './api/company/company.module';
import { ConfigurationModule } from './api/configuration/configuration.module';
import { DocumentsModule } from './api/documents/documents.module';
import { InvitesModule } from './api/invites/invites.module';
import { RiskScoreModule } from './api/risk-score/risk-score.module';
import { RolesModule } from './api/roles/roles.module';
import { UserModule } from './api/users/user.module';
import { AppController } from './app.controller';
import apiConfig from './configs/api.config';
import { CoreModule } from './core/core.module';
import { ExceptionFilter } from './exceptions/filters/exception.filter';
import { ApiKeyGuard } from './guards/api-key.guard';
import { AuthGuard } from './guards/auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { RequestRefererMiddleware } from './middlewares/request-referer.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({
      load: [apiConfig],
      cache: apiConfig().isProduction() === true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST'),
        port: config.get('POSTGRES_PORT') || 5432,
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DB'),
        autoLoadEntities: true,
        logging: config.get('POSTGRES_DB_LOGGING'),
        maxQueryExecutionTime: config.get('POSTGRES_DB_LOG_SLOW_QUERIES_SEC'),
        useUTC: true,
        connectTimeoutMS: config.get('POSTGRES_DB_CONNECTION_TIMEOUT_MS'),
        logNotifications:
          config.get('POSTGRES_DB_LOG_ENGINE_NOTIFICATIONS') === 'true',
        uuidExtension: 'uuid-ossp',
        ssl: config.get('POSTGRES_DB_SSL') === 'true',
        verboseRetryLog: true,
        migrationsTableName:
          config.get('POSTGRES_DB_MIGRATIONS_TABLE_NAME') || 'migrations',
        migrationsRun:
          config.get('POSTGRES_DB_RUN_MIGRATION_ON_STARTUP') === 'true',
        migrations: [config.get('POSTGRES_DB_MIGRATIONS')],
        synchronize: config.get('POSTGRES_DB_SYNCHRONIZE') === 'true',
        migrationsTransactionMode: config.get(
          'POSTGRES_DB_MIGRATIONS_TRANSACTION_MODE',
        ),
        dropSchema: config.get('POSTGRES_DB_DROP_SCHEMA') === 'true',
      }),
      inject: [ConfigService],
    }),
    ConfigurationModule,
    AssetModule,
    BankAccountModule,
    AccountModule,
    UserModule,
    AuthModule,
    CoreModule,
    DocumentsModule,
    CompanyModule,
    RolesModule,
    InvitesModule,
    RiskScoreModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestRefererMiddleware).forRoutes('*');
    if (!apiConfig().isProduction())
      consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
