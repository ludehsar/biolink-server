import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedMinimalColoredIconsInLinksTable1632768160908 implements MigrationInterface {
    name = 'AddedMinimalColoredIconsInLinksTable1632768160908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."link" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "public"."link" ADD "iconColorful" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."link" ADD "iconMinimal" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."link" DROP COLUMN "iconMinimal"`);
        await queryRunner.query(`ALTER TABLE "public"."link" DROP COLUMN "iconColorful"`);
        await queryRunner.query(`ALTER TABLE "public"."link" ADD "icon" character varying`);
    }

}
