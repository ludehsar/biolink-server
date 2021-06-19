import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedLatitudeAndLongitudeTypes1624116175458 implements MigrationInterface {
    name = 'ChangedLatitudeAndLongitudeTypes1624116175458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "longitude" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "longitude" integer`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "latitude" integer`);
    }

}
