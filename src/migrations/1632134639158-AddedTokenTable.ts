import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedTokenTable1632134639158 implements MigrationInterface {
    name = 'AddedTokenTable1632134639158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "token_type_enum" AS ENUM('access_token', 'refresh_token', 'email_verification_token', 'forgot_password_token')`);
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "type" "token_type_enum" DEFAULT 'refresh_token', "expires" TIMESTAMP, "blacklisted" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailActivationCode"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "forgotPasswordCode"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tokenCode"`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "tokenCode" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "forgotPasswordCode" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailActivationCode" character varying`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TYPE "token_type_enum"`);
    }

}
