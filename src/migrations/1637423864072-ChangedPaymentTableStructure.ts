import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedPaymentTableStructure1637423864072 implements MigrationInterface {
    name = 'ChangedPaymentTableStructure1637423864072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeAmountDue"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeAmountPaid"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeAmountRemaining"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeChargeId"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeInvoiceCreated"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripePaymentCurrency"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeCustomerId"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeCustomerAddress"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeCustomerEmail"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeCustomerName"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeCustomerPhone"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeCustomerShipping"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeDiscount"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeInvoicePdfUrl"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeInvoiceUrl"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripePriceId"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeSubscriptionId"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeInvoiceNumber"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripePeriodStart"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripePeriodEnd"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "stripeStatus"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentprovider_enum" AS ENUM('Stripe', 'PayPal')`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "paymentProvider" "public"."payment_paymentprovider_enum" NOT NULL DEFAULT 'Stripe'`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "amountPaid" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymentcurrency_enum" AS ENUM('usd')`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "paymentCurrency" "public"."payment_paymentcurrency_enum" NOT NULL DEFAULT 'usd'`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "paymentDetails" json`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "orderId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD CONSTRAINT "UQ_d09d285fe1645cd2f0db811e293" UNIQUE ("orderId")`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "planId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD "paymentId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD CONSTRAINT "UQ_9ad13532f48db4ac5a3b3dd70e5" UNIQUE ("paymentId")`);
        await queryRunner.query(`ALTER TYPE "public"."payment_paymenttype_enum" RENAME TO "payment_paymenttype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymenttype_enum" AS ENUM('Checkout', 'Subscription', 'Payout')`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ALTER COLUMN "paymentType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ALTER COLUMN "paymentType" TYPE "public"."payment_paymenttype_enum" USING "paymentType"::"text"::"public"."payment_paymenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ALTER COLUMN "paymentType" SET DEFAULT 'Checkout'`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymenttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD CONSTRAINT "FK_fb6e13226928c7ddcf2e1bf6160" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD CONSTRAINT "FK_9ad13532f48db4ac5a3b3dd70e5" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."order" DROP CONSTRAINT "FK_9ad13532f48db4ac5a3b3dd70e5"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP CONSTRAINT "FK_fb6e13226928c7ddcf2e1bf6160"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_paymenttype_enum_old" AS ENUM('Stripe', 'PayPal')`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ALTER COLUMN "paymentType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ALTER COLUMN "paymentType" TYPE "public"."payment_paymenttype_enum_old" USING "paymentType"::"text"::"public"."payment_paymenttype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ALTER COLUMN "paymentType" SET DEFAULT 'Stripe'`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymenttype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payment_paymenttype_enum_old" RENAME TO "payment_paymenttype_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP CONSTRAINT "UQ_9ad13532f48db4ac5a3b3dd70e5"`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP COLUMN "paymentId"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "planId"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP CONSTRAINT "UQ_d09d285fe1645cd2f0db811e293"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "orderId"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "paymentDetails"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "paymentCurrency"`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentcurrency_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "amountPaid"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "paymentProvider"`);
        await queryRunner.query(`DROP TYPE "public"."payment_paymentprovider_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripePeriodEnd" date`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripePeriodStart" date`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeInvoiceNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeSubscriptionId" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripePriceId" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeInvoiceUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeInvoicePdfUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeDiscount" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeCustomerShipping" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeCustomerPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeCustomerName" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeCustomerEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeCustomerAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeCustomerId" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripePaymentCurrency" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeInvoiceCreated" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeChargeId" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeAmountRemaining" integer`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeAmountPaid" integer`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "stripeAmountDue" integer`);
    }

}
