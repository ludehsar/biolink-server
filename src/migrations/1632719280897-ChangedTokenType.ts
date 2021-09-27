import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedTokenType1632719280897 implements MigrationInterface {
    name = 'ChangedTokenType1632719280897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."token_type_enum" RENAME TO "token_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."token_type_enum" AS ENUM('access_token', 'refresh_token', 'email_verification_token', 'reset_password_token')`);
        await queryRunner.query(`ALTER TABLE "public"."token" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."token" ALTER COLUMN "type" TYPE "public"."token_type_enum" USING "type"::"text"::"public"."token_type_enum"`);
        await queryRunner.query(`ALTER TABLE "public"."token" ALTER COLUMN "type" SET DEFAULT 'refresh_token'`);
        await queryRunner.query(`DROP TYPE "public"."token_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."token_type_enum_old" AS ENUM('access_token', 'refresh_token', 'email_verification_token', 'forgot_password_token')`);
        await queryRunner.query(`ALTER TABLE "public"."token" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "public"."token" ALTER COLUMN "type" TYPE "public"."token_type_enum_old" USING "type"::"text"::"public"."token_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "public"."token" ALTER COLUMN "type" SET DEFAULT 'refresh_token'`);
        await queryRunner.query(`DROP TYPE "public"."token_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."token_type_enum_old" RENAME TO "token_type_enum"`);
    }

}
