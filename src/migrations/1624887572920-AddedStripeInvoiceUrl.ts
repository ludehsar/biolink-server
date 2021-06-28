import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedStripeInvoiceUrl1624887572920 implements MigrationInterface {
    name = 'AddedStripeInvoiceUrl1624887572920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "stripeInvoiceUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "stripeInvoiceUrl"`);
    }

}
