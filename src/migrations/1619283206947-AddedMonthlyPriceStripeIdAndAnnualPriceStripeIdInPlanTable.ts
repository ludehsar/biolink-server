import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedMonthlyPriceStripeIdAndAnnualPriceStripeIdInPlanTable1619283206947 implements MigrationInterface {
    name = 'AddedMonthlyPriceStripeIdAndAnnualPriceStripeIdInPlanTable1619283206947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "lifetimePrice"`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "monthlyPriceStripeId" character varying`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "annualPriceStripeId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "annualPriceStripeId"`);
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "monthlyPriceStripeId"`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "lifetimePrice" double precision NOT NULL DEFAULT '0'`);
    }

}
