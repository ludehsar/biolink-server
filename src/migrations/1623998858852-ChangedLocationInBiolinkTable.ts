import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedLocationInBiolinkTable1623998858852 implements MigrationInterface {
    name = 'ChangedLocationInBiolinkTable1623998858852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "state" character varying`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "latitude" integer`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "longitude" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "location" character varying`);
    }

}
