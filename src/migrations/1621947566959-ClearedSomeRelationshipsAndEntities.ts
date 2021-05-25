import {MigrationInterface, QueryRunner} from "typeorm";

export class ClearedSomeRelationshipsAndEntities1621947566959 implements MigrationInterface {
    name = 'ClearedSomeRelationshipsAndEntities1621947566959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "clicks"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."link_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userRole"`);
        await queryRunner.query(`DROP TYPE "public"."user_userrole_enum"`);
        await queryRunner.query(`ALTER TABLE "plan" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "category" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD "ipAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "premium_username" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tax" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tax" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "premium_username" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "ipAddress"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "plan" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`CREATE TYPE "public"."user_userrole_enum" AS ENUM('Admin', 'User')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "userRole" "user_userrole_enum" NOT NULL DEFAULT 'User'`);
        await queryRunner.query(`CREATE TYPE "public"."link_status_enum" AS ENUM('Enabled', 'Disabled')`);
        await queryRunner.query(`ALTER TABLE "link" ADD "status" "link_status_enum" NOT NULL DEFAULT 'Disabled'`);
        await queryRunner.query(`ALTER TABLE "link" ADD "clicks" integer NOT NULL DEFAULT '0'`);
    }

}
