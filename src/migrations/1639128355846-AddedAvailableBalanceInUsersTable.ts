import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedAvailableBalanceInUsersTable1639128355846 implements MigrationInterface {
    name = 'AddedAvailableBalanceInUsersTable1639128355846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "availableBalance" double precision NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "availableBalance"`);
    }

}
