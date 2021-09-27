import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedLinkMinimalIconsLocation1632766796606 implements MigrationInterface {
    name = 'AddedLinkMinimalIconsLocation1632766796606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."link" DROP COLUMN "icon"`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "emailActivationCode" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "forgotPasswordCode" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "tokenCode" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."link" ADD "iconColorful" character varying`);
        await queryRunner.query(`ALTER TABLE "public"."link" ADD "iconMinimal" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."link" DROP COLUMN "iconMinimal"`);
        await queryRunner.query(`ALTER TABLE "public"."link" DROP COLUMN "iconColorful"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "tokenCode"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "forgotPasswordCode"`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "emailActivationCode"`);
        await queryRunner.query(`ALTER TABLE "public"."link" ADD "icon" character varying`);
    }

}
