import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedTrackLinksTable1618197626050 implements MigrationInterface {
    name = 'AddedTrackLinksTable1618197626050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "track_link" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "countryCode" character varying, "cityName" character varying, "osName" character varying, "browserName" character varying, "referrerHost" character varying, "referrerPath" character varying, "deviceType" character varying, "browserLanguage" character varying, "utmSource" character varying, "utmMedium" character varying, "utmCampaign" character varying, "isUnique" boolean, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "linkId" uuid, "projectId" uuid, CONSTRAINT "PK_7d496873aeb9162f01a67967f7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "visibilityStatus" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_3a9ae171c1eeda0c8b53f67ce52" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_0bb04d0ddd84ea9304e7beb4824" FOREIGN KEY ("linkId") REFERENCES "link"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_767fd655f1726d51e909cb97cf0" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_767fd655f1726d51e909cb97cf0"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_0bb04d0ddd84ea9304e7beb4824"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_3a9ae171c1eeda0c8b53f67ce52"`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "visibilityStatus" SET DEFAULT false`);
        await queryRunner.query(`DROP TABLE "track_link"`);
    }

}
