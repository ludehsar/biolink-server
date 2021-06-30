import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedLastActiveTillTypeToTimestamp1625033265767 implements MigrationInterface {
    name = 'ChangedLastActiveTillTypeToTimestamp1625033265767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActiveTill"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastActiveTill" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActiveTill"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastActiveTill" date`);
    }

}
