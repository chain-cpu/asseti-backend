import { MigrationInterface, QueryRunner } from "typeorm";

export class SecondaryAddress1667575237252 implements MigrationInterface {
    name = 'SecondaryAddress1667575237252'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "secondaryAddress" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "secondaryAddress"`);
    }

}
