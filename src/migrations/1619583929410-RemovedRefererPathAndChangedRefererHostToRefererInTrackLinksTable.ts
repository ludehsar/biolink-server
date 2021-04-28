import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedRefererPathAndChangedRefererHostToRefererInTrackLinksTable1619583929410 implements MigrationInterface {
    name = 'RemovedRefererPathAndChangedRefererHostToRefererInTrackLinksTable1619583929410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "referrerHost"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "referrerPath"`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD "referer" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "referer"`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD "referrerPath" character varying`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD "referrerHost" character varying`);
    }

}
