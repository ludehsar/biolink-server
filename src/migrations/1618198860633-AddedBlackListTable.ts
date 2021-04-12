import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedBlackListTable1618198860633 implements MigrationInterface {
    name = 'AddedBlackListTable1618198860633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "black_list" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "reason" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9650035f789e40cb2f917613eab" UNIQUE ("email"), CONSTRAINT "PK_6969ca1c62bdf4fef47a85b8195" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "visibilityStatus" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "visibilityStatus" SET DEFAULT false`);
        await queryRunner.query(`DROP TABLE "black_list"`);
    }

}
