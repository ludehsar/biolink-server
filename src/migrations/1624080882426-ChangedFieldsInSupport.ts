import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedFieldsInSupport1624080882426 implements MigrationInterface {
    name = 'ChangedFieldsInSupport1624080882426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "support" ADD "fullName" character varying`);
        await queryRunner.query(`ALTER TABLE "support" ADD "phoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "support" ADD "company" character varying`);
        await queryRunner.query(`ALTER TABLE "support" ADD "subject" character varying`);
        await queryRunner.query(`ALTER TABLE "support" ADD "message" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "subject"`);
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "company"`);
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "support" ADD "lastName" character varying`);
        await queryRunner.query(`ALTER TABLE "support" ADD "firstName" character varying`);
        await queryRunner.query(`ALTER TABLE "support" ADD "description" character varying`);
    }

}
