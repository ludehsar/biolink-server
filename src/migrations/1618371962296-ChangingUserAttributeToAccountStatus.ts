import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangingUserAttributeToAccountStatus1618371962296 implements MigrationInterface {
    name = 'ChangingUserAttributeToAccountStatus1618371962296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "activeStatus" TO "accountStatus"`);
        await queryRunner.query(`ALTER TYPE "public"."user_activestatus_enum" RENAME TO "user_accountstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "accountStatus" SET DEFAULT 'Active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "accountStatus" SET DEFAULT 'Inactive'`);
        await queryRunner.query(`ALTER TYPE "user_accountstatus_enum" RENAME TO "user_activestatus_enum"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "accountStatus" TO "activeStatus"`);
    }

}
