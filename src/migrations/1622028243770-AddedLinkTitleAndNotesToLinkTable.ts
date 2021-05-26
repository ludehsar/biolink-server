import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedLinkTitleAndNotesToLinkTable1622028243770 implements MigrationInterface {
    name = 'AddedLinkTitleAndNotesToLinkTable1622028243770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" ADD "linkTitle" character varying`);
        await queryRunner.query(`ALTER TABLE "link" ADD "note" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "linkTitle"`);
    }

}
