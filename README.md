# Assetize BE

The backend for the Assetize application

## Installation

### Git

Clone repository using SSH

### Yarn

Open terminal in the root directory and run

```bash
yarn install
```

### .env

Create .env file in the root directory copying .env.sample

## Running the app

Open terminal in the root directory and run

```bash
# development in watch mode
npm run start:docker
```
## Stop & Cleanup
```
npm run cleanup
```
The following command removes all volumes, database data and the dist folder

## Migration
Migrations can run in parallel with synchronization. This process can be controlled via .env
```bash
POSTGRES_DB_SYNCHRONIZE=false
POSTGRES_DB_RUN_MIGRATION_ON_STARTUP=true
```
```bash
# create migration file
npm run migration:create --name=<migration_name>
# generate migration file
npm run migration:generate --name=<migration_name>
# run migration
npm run migration:run
# revert migration
npm run migration:down
```

## Matomo

```bash
MYSQL_PASSWORD=<db password>
MYSQL_DATABASE=<db name>
MYSQL_USER=<db user>
MATOMO_APP_PORT=<port>
MATOMO_DATABASE_ADAPTER=mysql
MATOMO_DATABASE_TABLES_PREFIX=matomo_
MATOMO_DATABASE_USERNAME=<db user>
MATOMO_DATABASE_PASSWORD=<db password>
MATOMO_DATABASE_DBNAME=<db name>
```
After setting up Matomo using the link domain:<port>, need to add in matomo container in config (config/config.ini.php):

```bash
[General]
trusted_hosts[] = "domain:<port>"
cors_domains[] = *
```

## Test

Open terminal in the root directory and run

```bash
# unit tests
npm run test
```

```bash
# e2e tests
npm run test:e2e
```

```bash
# test coverage
npm run test:cov
```
