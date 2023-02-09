import { MigrationInterface, QueryRunner } from "typeorm"

export class migrations1666319918678 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN IF EXISTS "isFeatureOn"`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "configuration_features"
        (
          id uuid NOT NULL DEFAULT uuid_generate_v4(),
          name character varying(64) NOT NULL,
          description character varying(512) NOT NULL DEFAULT ''::character varying,
          "isActive" boolean NOT NULL DEFAULT false,
          CONSTRAINT "PK_482177a592b2c4b2092221be2ef" PRIMARY KEY (id),
          CONSTRAINT uni_feature UNIQUE (name)
         );
    `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
