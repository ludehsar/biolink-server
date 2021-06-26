import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedFeaturedInCategoriesAndBiolinks1624625298810 implements MigrationInterface {
    name = 'AddedFeaturedInCategoriesAndBiolinks1624625298810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" ADD "featured" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "category" ADD "featured" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "featured"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "featured"`);
    }

}
