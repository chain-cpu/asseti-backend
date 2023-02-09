import { MigrationInterface, QueryRunner } from "typeorm"
import { FeatureEntity } from "../api/configuration/feature/feature.entity";
import { featureFlagsConfig } from "../configs/feature-flags.config";

export class FeatureFlags1667382843071 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const featuresRepo = queryRunner.connection.getRepository(FeatureEntity);
        for(let index = 0; index < featureFlagsConfig.length; index ++) {
            const feature = new FeatureEntity();
            const featureFlag = featureFlagsConfig[index];
            feature.name = featureFlag.name;
            feature.description = featureFlag.description;
            feature.isActive = featureFlag.isActive;
            await featuresRepo.save(feature);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
