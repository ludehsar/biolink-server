import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedPaymentSubscriptionIdToStripeSubscriptionIdInUsersTable1619283036556 implements MigrationInterface {
    name = 'ChangedPaymentSubscriptionIdToStripeSubscriptionIdInUsersTable1619283036556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "paymentSubscriptionId" TO "stripeSubscriptionId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "stripeSubscriptionId" TO "paymentSubscriptionId"`);
    }

}
