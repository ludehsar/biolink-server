import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedLinkTypeFromLinks1618980289557 implements MigrationInterface {
    name = 'RemovedLinkTypeFromLinks1618980289557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "linkType"`);
        await queryRunner.query(`DROP TYPE "public"."link_linktype_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."link_linktype_enum" AS ENUM('BioLink', 'Link')`);
        await queryRunner.query(`ALTER TABLE "link" ADD "linkType" "link_linktype_enum" NOT NULL DEFAULT 'Link'`);
    }

}
