import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedPageTable1618375495543 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "page"`);
        await queryRunner.query(`DROP TYPE "page_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "page_type_enum" AS ENUM('Internal', 'External')`);
        await queryRunner.query(`CREATE TABLE "page" ("id" SERIAL NOT NULL, "type" "page_type_enum" NOT NULL DEFAULT 'Internal', "externalUrl" character varying, "title" character varying NOT NULL, "slug" character varying, "content" character varying, "shortDescription" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6eb7269e2ff9f7d06893acebf16" UNIQUE ("title"), CONSTRAINT "UQ_875a4ba4aebdc1855dbf176dadb" UNIQUE ("slug"), CONSTRAINT "PK_742f4117e065c5b6ad21b37ba1f" PRIMARY KEY ("id"))`);
    }

}
