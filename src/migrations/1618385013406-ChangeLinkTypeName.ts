import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeLinkTypeName1618385013406 implements MigrationInterface {
    name = 'ChangeLinkTypeName1618385013406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" RENAME COLUMN "scheme" TO "linkType"`);
        await queryRunner.query(`ALTER TYPE "public"."link_scheme_enum" RENAME TO "link_linktype_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "link_linktype_enum" RENAME TO "link_scheme_enum"`);
        await queryRunner.query(`ALTER TABLE "link" RENAME COLUMN "linkType" TO "scheme"`);
    }

}
