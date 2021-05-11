import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedExtraAttributesInUserLogs1620744142921 implements MigrationInterface {
    name = 'AddedExtraAttributesInUserLogs1620744142921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_logs" ADD "cityName" character varying`);
        await queryRunner.query(`ALTER TABLE "user_logs" ADD "countryCode" character varying`);
        await queryRunner.query(`ALTER TABLE "user_logs" ADD "browserName" character varying`);
        await queryRunner.query(`ALTER TABLE "user_logs" ADD "browserLanguage" character varying`);
        await queryRunner.query(`ALTER TABLE "user_logs" ADD "deviceType" character varying`);
        await queryRunner.query(`ALTER TABLE "user_logs" ADD "osName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_logs" DROP COLUMN "osName"`);
        await queryRunner.query(`ALTER TABLE "user_logs" DROP COLUMN "deviceType"`);
        await queryRunner.query(`ALTER TABLE "user_logs" DROP COLUMN "browserLanguage"`);
        await queryRunner.query(`ALTER TABLE "user_logs" DROP COLUMN "browserName"`);
        await queryRunner.query(`ALTER TABLE "user_logs" DROP COLUMN "countryCode"`);
        await queryRunner.query(`ALTER TABLE "user_logs" DROP COLUMN "cityName"`);
    }

}
