import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedLinkImageUrl1623905311133 implements MigrationInterface {
    name = 'AddedLinkImageUrl1623905311133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" ADD "linkImageUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "linkImageUrl"`);
    }

}
