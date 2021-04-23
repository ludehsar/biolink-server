import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedShortUrlLinkTypeAndDeletedAtIntoLinkTable1619152714089 implements MigrationInterface {
    name = 'AddedShortUrlLinkTypeAndDeletedAtIntoLinkTable1619152714089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "link_linktype_enum" AS ENUM('Link', 'Embed')`);
        await queryRunner.query(`ALTER TABLE "link" ADD "linkType" "link_linktype_enum" NOT NULL DEFAULT 'Link'`);
        await queryRunner.query(`ALTER TABLE "link" ADD "shortenedUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "link" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "shortenedUrl"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "linkType"`);
        await queryRunner.query(`DROP TYPE "link_linktype_enum"`);
    }

}
