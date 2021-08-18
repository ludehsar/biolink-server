import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedFolloweesInFollowTable1629261193547 implements MigrationInterface {
    name = 'AddedFolloweesInFollowTable1629261193547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" ADD "followeeId" uuid`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_38b54e7a93cf8a2f000971a61ed" FOREIGN KEY ("followeeId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_38b54e7a93cf8a2f000971a61ed"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP COLUMN "followeeId"`);
    }

}
