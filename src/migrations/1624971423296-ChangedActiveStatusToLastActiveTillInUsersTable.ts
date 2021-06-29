import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedActiveStatusToLastActiveTillInUsersTable1624971423296 implements MigrationInterface {
    name = 'ChangedActiveStatusToLastActiveTillInUsersTable1624971423296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "accountStatus" TO "lastActiveTill"`);
        await queryRunner.query(`ALTER TYPE "public"."user_accountstatus_enum" RENAME TO "user_lastactivetill_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActiveTill"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastActiveTill" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActiveTill"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastActiveTill" "user_lastactivetill_enum" NOT NULL DEFAULT 'Active'`);
        await queryRunner.query(`ALTER TYPE "user_lastactivetill_enum" RENAME TO "user_accountstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "lastActiveTill" TO "accountStatus"`);
    }

}
