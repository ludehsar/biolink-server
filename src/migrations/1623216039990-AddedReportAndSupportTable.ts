import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedReportAndSupportTable1623216039990 implements MigrationInterface {
    name = 'AddedReportAndSupportTable1623216039990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "report_status_enum" AS ENUM('Pending', 'Resolved', 'Dismissed')`);
        await queryRunner.query(`CREATE TABLE "report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reportedUrl" character varying, "description" character varying, "status" "report_status_enum" NOT NULL DEFAULT 'Pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "reporterId" uuid, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "support_status_enum" AS ENUM('Pending', 'Resolved', 'Dismissed')`);
        await queryRunner.query(`CREATE TABLE "support" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userEmail" character varying, "description" character varying, "status" "support_status_enum" NOT NULL DEFAULT 'Pending', "supportReply" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_54c6021e6f6912eaaee36b3045d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_253163ca85b927f62596606f6cc" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_0768a9a514d90be0f9d00fd8036" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_0768a9a514d90be0f9d00fd8036"`);
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_253163ca85b927f62596606f6cc"`);
        await queryRunner.query(`DROP TABLE "support"`);
        await queryRunner.query(`DROP TYPE "support_status_enum"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TYPE "report_status_enum"`);
    }

}
