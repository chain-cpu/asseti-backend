import { MigrationInterface, QueryRunner } from "typeorm";

export class migrations1668047158080 implements MigrationInterface {
    name = 'migrations1668047158080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "location" character varying(512) NOT NULL DEFAULT '', "description" character varying(1024) NOT NULL DEFAULT '', "meta" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_013e7b742fb1b5b2e6602446d8a" UNIQUE ("name"), CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id")); COMMENT ON COLUMN "assets"."id" IS 'File ID'; COMMENT ON COLUMN "assets"."name" IS 'Asset name'; COMMENT ON COLUMN "assets"."location" IS 'Asset location (path)'; COMMENT ON COLUMN "assets"."description" IS 'Asset description'`);
        await queryRunner.query(`CREATE TYPE "public"."assets_state_status_enum" AS ENUM('Accepted', 'Accepted Updated Version', 'Not Accepted')`);
        await queryRunner.query(`CREATE TABLE "assets_state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."assets_state_status_enum" NOT NULL DEFAULT 'Not Accepted', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "assetId" uuid, "userId" uuid, CONSTRAINT "PK_a4e0df42e22e69f100bd43d9c7b" PRIMARY KEY ("id")); COMMENT ON COLUMN "assets_state"."id" IS 'Asset state ID'; COMMENT ON COLUMN "assets_state"."assetId" IS 'File ID'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e2319e406365f6654b847ecd25" ON "assets_state" ("assetId", "userId") `);
        await queryRunner.query(`ALTER TABLE "assets_state" ADD CONSTRAINT "FK_223a5f492727f383a3422da758a" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "assets_state" ADD CONSTRAINT "FK_ad080dd49ef37637343788ce070" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets_state" DROP CONSTRAINT "FK_ad080dd49ef37637343788ce070"`);
        await queryRunner.query(`ALTER TABLE "assets_state" DROP CONSTRAINT "FK_223a5f492727f383a3422da758a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e2319e406365f6654b847ecd25"`);
        await queryRunner.query(`DROP TABLE "assets_state"`);
        await queryRunner.query(`DROP TYPE "public"."assets_state_status_enum"`);
        await queryRunner.query(`DROP TABLE "assets"`);
    }

}
