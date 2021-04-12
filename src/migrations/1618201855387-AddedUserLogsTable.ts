import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedUserLogsTable1618201855387 implements MigrationInterface {
    name = 'AddedUserLogsTable1618201855387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" character varying, "type" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_773dbba6ad8ad2cdecfef243953" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "visibilityStatus" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "user_logs" ADD CONSTRAINT "FK_21c46c2b3ab66ef0773e5db3464" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_logs" DROP CONSTRAINT "FK_21c46c2b3ab66ef0773e5db3464"`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "visibilityStatus" SET DEFAULT false`);
        await queryRunner.query(`DROP TABLE "user_logs"`);
    }

}
