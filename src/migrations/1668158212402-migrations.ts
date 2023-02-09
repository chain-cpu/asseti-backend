import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1668158212402 implements MigrationInterface {
  name = 'migrations1668158212402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "uni_bank_account"`);
    // await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "iban"`);
    // await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "iban" character varying(34) NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "uni_bank_account" UNIQUE ("iban", "accountId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`ALTER TABLE "bank_accounts" DROP CONSTRAINT "uni_bank_account"`);
    // await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "iban"`);
    // await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "iban" numeric NOT NULL`);
    // await queryRunner.query(`ALTER TABLE "bank_accounts" ADD CONSTRAINT "uni_bank_account" UNIQUE ("accountId", "iban")`);
  }
}
