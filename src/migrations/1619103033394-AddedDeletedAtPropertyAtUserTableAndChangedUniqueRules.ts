import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedDeletedAtPropertyAtUserTableAndChangedUniqueRules1619103033394 implements MigrationInterface {
    name = 'AddedDeletedAtPropertyAtUserTableAndChangedUniqueRules1619103033394'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_67f5b68a05c3ded5f1123742d4e"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_7aa69905302b42689211f9bb91e"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_094936cc710c3c37426eb4d8c21" UNIQUE ("email", "deletedAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_094936cc710c3c37426eb4d8c21"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_7aa69905302b42689211f9bb91e" UNIQUE ("forgotPasswordCode")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_67f5b68a05c3ded5f1123742d4e" UNIQUE ("emailActivationCode")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    }

}
