import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedPasswordProtectionInLinks1621954437226 implements MigrationInterface {
    name = 'AddedPasswordProtectionInLinks1621954437226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" ADD "enablePasswordProtection" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "link" ADD "password" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "enablePasswordProtection"`);
    }

}
