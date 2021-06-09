import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedUserNameAndEmailToReportsAndSupport1623219181929 implements MigrationInterface {
    name = 'AddedUserNameAndEmailToReportsAndSupport1623219181929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "userEmail"`);
        await queryRunner.query(`ALTER TABLE "report" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "report" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "report" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "support" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "support" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "support" ADD "email" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "support" ADD "userEmail" character varying`);
    }

}
