import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedIsUniqueFromTrackLinksTable1619585705821 implements MigrationInterface {
    name = 'RemovedIsUniqueFromTrackLinksTable1619585705821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "isUnique"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_link" ADD "isUnique" boolean`);
    }

}
