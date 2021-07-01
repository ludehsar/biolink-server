import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedEmailVerifiedAtToTimestamp1625061878945 implements MigrationInterface {
    name = 'ChangedEmailVerifiedAtToTimestamp1625061878945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerifiedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerifiedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerifiedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerifiedAt" date`);
    }

}
