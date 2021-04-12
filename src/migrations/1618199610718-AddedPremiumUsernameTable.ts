import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedPremiumUsernameTable1618199610718 implements MigrationInterface {
    name = 'AddedPremiumUsernameTable1618199610718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "premium_username_usernametype_enum" AS ENUM('Premium', 'Trademark')`);
        await queryRunner.query(`CREATE TABLE "premium_username" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "price" integer NOT NULL, "usernameType" "premium_username_usernametype_enum" NOT NULL DEFAULT 'Premium', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" date, CONSTRAINT "UQ_495381b6ceaf57c97b696e6a0e4" UNIQUE ("username"), CONSTRAINT "PK_e34fa4c1788de9cbdd867fb21aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "visibilityStatus" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "visibilityStatus" SET DEFAULT false`);
        await queryRunner.query(`DROP TABLE "premium_username"`);
        await queryRunner.query(`DROP TYPE "premium_username_usernametype_enum"`);
    }

}
