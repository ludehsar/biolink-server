import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedPaymentsField1623819382916 implements MigrationInterface {
    name = 'ChangedPaymentsField1623819382916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "stripeSubscriptionId" TO "stripeCustomerId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "clientIp"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripePaymentCreatedAt"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "methodType"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "cardBrand"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "cvcCheck"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "expMonth"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "expYear"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "funding"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "cardId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "last4"`);
        await queryRunner.query(`CREATE TYPE "payment_paymenttype_enum" AS ENUM('Stripe', 'PayPal')`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "paymentType" "payment_paymenttype_enum" NOT NULL DEFAULT 'Stripe'`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeAmountDue" integer`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeAmountPaid" integer`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeAmountRemaining" integer`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeChargeId" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeInvoiceCreated" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripePaymentCurrency" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeCustomerId" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeCustomerAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeCustomerEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeCustomerName" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeCustomerPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeCustomerShipping" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeDiscount" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeInvoicePdfUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripePriceId" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeSubscriptionId" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeInvoiceNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripePeriodStart" date`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripePeriodEnd" date`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeStatus" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeStatus"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripePeriodEnd"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripePeriodStart"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeInvoiceNumber"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeSubscriptionId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripePriceId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeInvoicePdfUrl"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeDiscount"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeCustomerShipping"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeCustomerPhone"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeCustomerName"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeCustomerEmail"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeCustomerAddress"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeCustomerId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripePaymentCurrency"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeInvoiceCreated"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeChargeId"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeAmountRemaining"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeAmountPaid"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeAmountDue"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "paymentType"`);
        await queryRunner.query(`DROP TYPE "payment_paymenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "last4" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "cardId" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "funding" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "expYear" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "expMonth" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "cvcCheck" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "cardBrand" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "methodType" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripePaymentCreatedAt" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "clientIp" character varying`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "stripeCustomerId" TO "stripeSubscriptionId"`);
    }

}
