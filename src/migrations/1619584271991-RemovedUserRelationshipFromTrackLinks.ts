import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedUserRelationshipFromTrackLinks1619584271991 implements MigrationInterface {
    name = 'RemovedUserRelationshipFromTrackLinks1619584271991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_3a9ae171c1eeda0c8b53f67ce52"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "userId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_link" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_3a9ae171c1eeda0c8b53f67ce52" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
