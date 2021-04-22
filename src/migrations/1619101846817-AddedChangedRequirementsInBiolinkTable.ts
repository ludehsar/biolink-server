import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedChangedRequirementsInBiolinkTable1619101846817 implements MigrationInterface {
    name = 'AddedChangedRequirementsInBiolinkTable1619101846817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "settings"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "profilePhotoUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "coverPhotoUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "displayName" character varying`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "location" character varying`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "bio" character varying`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "settings" json`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "addedToDirectory" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "addedToDirectory"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "settings"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "displayName"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "coverPhotoUrl"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "profilePhotoUrl"`);
        await queryRunner.query(`ALTER TABLE "link" ADD "settings" json`);
    }

}
