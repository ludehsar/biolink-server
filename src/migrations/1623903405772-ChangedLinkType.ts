import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedLinkType1623903405772 implements MigrationInterface {
    name = 'ChangedLinkType1623903405772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "link_linktype_enum" RENAME TO "link_linktype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "link_linktype_enum" AS ENUM('Link', 'Embed', 'Line')`);
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "linkType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "linkType" TYPE "link_linktype_enum" USING "linkType"::"text"::"link_linktype_enum"`);
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "linkType" SET DEFAULT 'Link'`);
        await queryRunner.query(`DROP TYPE "link_linktype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "link_linktype_enum_old" AS ENUM('Link', 'Embed')`);
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "linkType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "linkType" TYPE "link_linktype_enum_old" USING "linkType"::"text"::"link_linktype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "linkType" SET DEFAULT 'Link'`);
        await queryRunner.query(`DROP TYPE "link_linktype_enum"`);
        await queryRunner.query(`ALTER TYPE "link_linktype_enum_old" RENAME TO "link_linktype_enum"`);
    }

}
