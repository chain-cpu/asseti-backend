import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1667548754770 implements MigrationInterface {
    name = 'migrations1667548754770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "number"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "swiftAddress"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "iban" numeric NOT NULL`);
        await queryRunner.query(
          `ALTER TABLE "bank_accounts" ADD CONSTRAINT "uniq_accountId_iban" UNIQUE ("accountId", "iban")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bank_accounts" DROP COLUMN "iban"`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "swiftAddress" character varying(11) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "bank_accounts" ADD "number" numeric NOT NULL`);
    }

}
