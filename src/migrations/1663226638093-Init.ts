import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1663226638093 implements MigrationInterface {
    name = 'Init1663226638093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "logo" character varying, "legalEntityName" character varying, "legalEntityType" character varying, "companyName" character varying, "country" character varying, "address" character varying, "companyNumber" integer, "description" character varying, "website" character varying, "companyAge" integer, "location" character varying, "industryGroups" character varying, "peopleQuantity" integer, "mrr" integer, "debtRatio" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."permission_action_enum" AS ENUM('manage', 'create', 'read', 'update', 'delete')`);
        await queryRunner.query(`CREATE TYPE "public"."permission_object_enum" AS ENUM('all', 'account', 'user', 'role', 'permission', 'company')`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "action" "public"."permission_action_enum" NOT NULL, "object" "public"."permission_object_enum" NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "authSub" character varying NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "lastName" character varying, "avatar" character varying, "companyRole" character varying, "dob" character varying, "age" character varying, "gender" character varying, "address" character varying, "linkedin" character varying, "isAuthority" character varying, "workingExperience" character varying, "status" character varying NOT NULL DEFAULT 'Inactive', "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer, "accountId" uuid, CONSTRAINT "UQ_f89ee37f465e89f7cb0c60e8bfa" UNIQUE ("authSub"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."account_type_enum" AS ENUM('Borrower', 'Lender', 'Partner')`);
        await queryRunner.query(`CREATE TYPE "public"."account_partnertype_enum" AS ENUM('Angel Investor', 'Accelerator or Incubator', 'Venture Capitalist', 'Other')`);
        await queryRunner.query(`CREATE TYPE "public"."account_lendertype_enum" AS ENUM('Individual', 'Institutional')`);
        await queryRunner.query(`CREATE TYPE "public"."account_status_enum" AS ENUM('New', 'Active', 'Inactive')`);
        await queryRunner.query(`CREATE TYPE "public"."account_kyc_enum" AS ENUM('Pending', 'Not Verified', 'Verified', 'Failed')`);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(120) NOT NULL DEFAULT '', "name" character varying(120) NOT NULL, "type" "public"."account_type_enum" NOT NULL, "partnerType" "public"."account_partnertype_enum", "lenderType" "public"."account_lendertype_enum", "survey" character varying NOT NULL DEFAULT '', "amount" numeric(5,2) NOT NULL DEFAULT '0', "status" "public"."account_status_enum" NOT NULL DEFAULT 'New', "kyc" "public"."account_kyc_enum" NOT NULL DEFAULT 'Pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid, CONSTRAINT "UQ_4c8f96ccf523e9a3faefd5bdd4c" UNIQUE ("email"), CONSTRAINT "REL_2d01dcea17c1dbaa448a235ac5" UNIQUE ("companyId"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."bank_accounts_currency_enum" AS ENUM('USD', 'EUR')`);
        await queryRunner.query(`CREATE TABLE "bank_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(256), "name" character varying(256) NOT NULL, "address" character varying(256) NOT NULL, "number" numeric NOT NULL, "swiftAddress" character varying(11) NOT NULL, "swiftCode" character varying(11) NOT NULL, "currency" "public"."bank_accounts_currency_enum" NOT NULL DEFAULT 'USD', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" uuid, CONSTRAINT "uni_bank_account" UNIQUE ("number", "accountId"), CONSTRAINT "PK_c872de764f2038224a013ff25ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "creator" character varying NOT NULL, "email" character varying NOT NULL, "roleId" integer, "accountId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_658d8246180c0345d32a100544e" UNIQUE ("email"), CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions_permission" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_b817d7eca3b85f22130861259dd" PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b36cb2e04bc353ca4ede00d87b" ON "role_permissions_permission" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bfbc9e263d4cea6d7a8c9eb3ad" ON "role_permissions_permission" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_2d01dcea17c1dbaa448a235ac57" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "FK_bf97ed64ce3918211d645a39af3" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_900a3ed40499c79c1c289fec284" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_e14fb6a45526215fa02193ff6a2" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2"`);
        await queryRunner.query(`ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_e14fb6a45526215fa02193ff6a2"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_900a3ed40499c79c1c289fec284"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "FK_bf97ed64ce3918211d645a39af3"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_2d01dcea17c1dbaa448a235ac57"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bfbc9e263d4cea6d7a8c9eb3ad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b36cb2e04bc353ca4ede00d87b"`);
        await queryRunner.query(`DROP TABLE "role_permissions_permission"`);
        await queryRunner.query(`DROP TABLE "invite"`);
        await queryRunner.query(`DROP TABLE "bank_accounts"`);
        await queryRunner.query(`DROP TYPE "public"."bank_accounts_currency_enum"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TYPE "public"."account_kyc_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_lendertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_partnertype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TYPE "public"."permission_object_enum"`);
        await queryRunner.query(`DROP TYPE "public"."permission_action_enum"`);
        await queryRunner.query(`DROP TABLE "company"`);
    }

}
