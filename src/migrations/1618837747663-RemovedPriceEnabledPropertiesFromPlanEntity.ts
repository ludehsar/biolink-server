import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedPriceEnabledPropertiesFromPlanEntity1618837747663 implements MigrationInterface {
    name = 'RemovedPriceEnabledPropertiesFromPlanEntity1618837747663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "monthlyPriceEnabled"`);
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "annualPriceEnabled"`);
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "lifetimePriceEnabled"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" ADD "lifetimePriceEnabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "annualPriceEnabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "monthlyPriceEnabled" boolean NOT NULL DEFAULT false`);
    }

}
