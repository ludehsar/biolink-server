import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedFolloweesFromFollowTable1629261144138 implements MigrationInterface {
    name = 'RemovedFolloweesFromFollowTable1629261144138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_38b54e7a93cf8a2f000971a61ed"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP COLUMN "followeeId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" ADD "followeeId" uuid`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_38b54e7a93cf8a2f000971a61ed" FOREIGN KEY ("followeeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
