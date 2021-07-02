import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedLinkColor1625235203961 implements MigrationInterface {
    name = 'AddedLinkColor1625235203961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" ADD "linkColor" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "linkColor"`);
    }

}
