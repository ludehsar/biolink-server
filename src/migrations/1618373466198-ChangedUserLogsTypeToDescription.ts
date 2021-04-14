import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedUserLogsTypeToDescription1618373466198 implements MigrationInterface {
    name = 'ChangedUserLogsTypeToDescription1618373466198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "type" TO "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "description" TO "type"`);
    }

}
