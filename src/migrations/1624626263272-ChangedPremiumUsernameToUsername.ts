import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedPremiumUsernameToUsername1624626263272 implements MigrationInterface {
    name = 'ChangedPremiumUsernameToUsername1624626263272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "UQ_169e8c8d3b044c00bea1630b282"`);
        await queryRunner.query(`CREATE TYPE "username_premiumtype_enum" AS ENUM('None', 'Premium', 'Trademark')`);
        await queryRunner.query(`CREATE TABLE "username" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "premiumType" "username_premiumtype_enum" NOT NULL DEFAULT 'None', "expireDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerId" uuid, "biolinkId" uuid, CONSTRAINT "UQ_b39ad32e514b17e90c93988888a" UNIQUE ("username"), CONSTRAINT "PK_fd8e31cc54a22af809d3fbf587b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "premium_username" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "premium_username" DROP COLUMN "usernameType"`);
        await queryRunner.query(`DROP TYPE "public"."premium_username_usernametype_enum"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "changedUsername" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "usernameId" uuid`);
        await queryRunner.query(`CREATE TYPE "premium_username_premiumtype_enum" AS ENUM('None', 'Premium', 'Trademark')`);
        await queryRunner.query(`ALTER TABLE "premium_username" ADD "premiumType" "premium_username_premiumtype_enum" NOT NULL DEFAULT 'None'`);
        await queryRunner.query(`ALTER TABLE "premium_username" ADD "expireDate" date`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "UQ_286f699402052a53ca1b589caae" UNIQUE ("usernameId", "deletedAt")`);
        await queryRunner.query(`ALTER TABLE "username" ADD CONSTRAINT "FK_bbd740a15c421eb047c83f84d77" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "username" ADD CONSTRAINT "FK_cf5379446c7770ce52819823aa6" FOREIGN KEY ("biolinkId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369"`);
        await queryRunner.query(`ALTER TABLE "username" DROP CONSTRAINT "FK_cf5379446c7770ce52819823aa6"`);
        await queryRunner.query(`ALTER TABLE "username" DROP CONSTRAINT "FK_bbd740a15c421eb047c83f84d77"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "UQ_286f699402052a53ca1b589caae"`);
        await queryRunner.query(`ALTER TABLE "premium_username" DROP COLUMN "expireDate"`);
        await queryRunner.query(`ALTER TABLE "premium_username" DROP COLUMN "premiumType"`);
        await queryRunner.query(`DROP TYPE "premium_username_premiumtype_enum"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "usernameId"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "changedUsername"`);
        await queryRunner.query(`CREATE TYPE "public"."premium_username_usernametype_enum" AS ENUM('Premium', 'Trademark')`);
        await queryRunner.query(`ALTER TABLE "premium_username" ADD "usernameType" "premium_username_usernametype_enum" NOT NULL DEFAULT 'Premium'`);
        await queryRunner.query(`ALTER TABLE "premium_username" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "username"`);
        await queryRunner.query(`DROP TYPE "username_premiumtype_enum"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "UQ_169e8c8d3b044c00bea1630b282" UNIQUE ("username", "deletedAt")`);
    }

}
