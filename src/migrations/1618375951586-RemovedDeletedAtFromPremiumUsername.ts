import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedDeletedAtFromPremiumUsername1618375951586 implements MigrationInterface {
    name = 'RemovedDeletedAtFromPremiumUsername1618375951586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "premium_username" DROP COLUMN "deletedAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "premium_username" ADD "deletedAt" date`);
    }

}
