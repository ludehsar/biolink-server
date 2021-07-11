import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedFollowTable1625933470317 implements MigrationInterface {
    name = 'AddedFollowTable1625933470317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "followerId" uuid, "followeeId" uuid, CONSTRAINT "PK_fda88bc28a84d2d6d06e19df6e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_550dce89df9570f251b6af2665a" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_38b54e7a93cf8a2f000971a61ed" FOREIGN KEY ("followeeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_38b54e7a93cf8a2f000971a61ed"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_550dce89df9570f251b6af2665a"`);
        await queryRunner.query(`DROP TABLE "follow"`);
    }

}
