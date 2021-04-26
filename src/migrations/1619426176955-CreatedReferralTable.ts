import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedReferralTable1619426176955 implements MigrationInterface {
    name = 'CreatedReferralTable1619426176955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "referral" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "referredByEmail" character varying, "referredByName" character varying, "referredToEmail" character varying, "referredToName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "referredById" uuid, CONSTRAINT "PK_a2d3e935a6591168066defec5ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "referral" ADD CONSTRAINT "FK_fc12cab7df2de5a584c10c57480" FOREIGN KEY ("referredById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "referral" DROP CONSTRAINT "FK_fc12cab7df2de5a584c10c57480"`);
        await queryRunner.query(`DROP TABLE "referral"`);
    }

}
