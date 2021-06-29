import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedShowInActivityInUserLogs1624972130012 implements MigrationInterface {
    name = 'AddedShowInActivityInUserLogs1624972130012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_logs" ADD "showInActivity" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_logs" DROP COLUMN "showInActivity"`);
    }

}
