import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedRepresentedIdInPaymentTable1637927705833 implements MigrationInterface {
    name = 'AddedRepresentedIdInPaymentTable1637927705833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD "representedId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."payment" ADD CONSTRAINT "UQ_98974bfaf551a0257b9d5ed8fd7" UNIQUE ("representedId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP CONSTRAINT "UQ_98974bfaf551a0257b9d5ed8fd7"`);
        await queryRunner.query(`ALTER TABLE "public"."payment" DROP COLUMN "representedId"`);
    }

}
