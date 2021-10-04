import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedSomeFieldsToNullableTrue1633368902671 implements MigrationInterface {
    name = 'ChangedSomeFieldsToNullableTrue1633368902671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."username" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."black_list" DROP CONSTRAINT "UQ_6d45b0e085cdea0bdfaf7d1ba41"`);
        await queryRunner.query(`ALTER TABLE "public"."black_list" ALTER COLUMN "keyword" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."category" ALTER COLUMN "categoryName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."code" ALTER COLUMN "code" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."domain" ALTER COLUMN "host" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_094936cc710c3c37426eb4d8c21"`);
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "encryptedPassword" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."plan" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."settings" ALTER COLUMN "key" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."tax" ALTER COLUMN "internalName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."tax" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."tax" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."token" ALTER COLUMN "token" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."admin_role" ALTER COLUMN "roleName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."black_list" ADD CONSTRAINT "UQ_6d45b0e085cdea0bdfaf7d1ba41" UNIQUE ("blacklistType", "keyword")`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_094936cc710c3c37426eb4d8c21" UNIQUE ("email", "deletedAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP CONSTRAINT "UQ_094936cc710c3c37426eb4d8c21"`);
        await queryRunner.query(`ALTER TABLE "public"."black_list" DROP CONSTRAINT "UQ_6d45b0e085cdea0bdfaf7d1ba41"`);
        await queryRunner.query(`ALTER TABLE "public"."admin_role" ALTER COLUMN "roleName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."token" ALTER COLUMN "token" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."tax" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."tax" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."tax" ALTER COLUMN "internalName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."settings" ALTER COLUMN "key" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."plan" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "encryptedPassword" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."user" ADD CONSTRAINT "UQ_094936cc710c3c37426eb4d8c21" UNIQUE ("email", "deletedAt")`);
        await queryRunner.query(`ALTER TABLE "public"."domain" ALTER COLUMN "host" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."code" ALTER COLUMN "code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."category" ALTER COLUMN "categoryName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."black_list" ALTER COLUMN "keyword" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."black_list" ADD CONSTRAINT "UQ_6d45b0e085cdea0bdfaf7d1ba41" UNIQUE ("blacklistType", "keyword")`);
        await queryRunner.query(`ALTER TABLE "public"."username" ALTER COLUMN "username" SET NOT NULL`);
    }

}
