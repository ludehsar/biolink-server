import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedPaymentTable1619318036854 implements MigrationInterface {
    name = 'CreatedPaymentTable1619318036854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stripeId" character varying, "clientIp" character varying, "stripePaymentCreatedAt" character varying, "email" character varying, "methodType" character varying, "cardBrand" character varying, "country" character varying, "cvcCheck" character varying, "expMonth" character varying, "expYear" character varying, "funding" character varying, "cardId" character varying, "last4" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_b046318e0b341a7f72110b75857" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_b046318e0b341a7f72110b75857"`);
        await queryRunner.query(`DROP TABLE "payment"`);
    }

}
