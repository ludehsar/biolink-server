import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedReferrerToCodesTable1619424337874 implements MigrationInterface {
    name = 'AddedReferrerToCodesTable1619424337874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "code" ADD "referrerId" uuid`);
        await queryRunner.query(`ALTER TABLE "code" ADD CONSTRAINT "FK_1d16fe2b4b3993e5a8d26e4909d" FOREIGN KEY ("referrerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_1d16fe2b4b3993e5a8d26e4909d"`);
        await queryRunner.query(`ALTER TABLE "code" DROP COLUMN "referrerId"`);
        await queryRunner.query(`ALTER TABLE "code" DROP COLUMN "deletedAt"`);
    }

}
