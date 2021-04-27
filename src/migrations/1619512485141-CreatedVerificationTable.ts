import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedVerificationTable1619512485141 implements MigrationInterface {
    name = 'CreatedVerificationTable1619512485141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "verification_verificationstatus_enum" AS ENUM('Pending', 'Verified', 'Rejected')`);
        await queryRunner.query(`CREATE TABLE "verification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "verificationStatus" "verification_verificationstatus_enum" NOT NULL DEFAULT 'Pending', "username" character varying, "firstName" character varying, "lastName" character varying, "mobileNumber" character varying, "workNumber" character varying, "email" character varying, "websiteLink" character varying, "instagramUrl" character varying, "twitterUrl" character varying, "linkedinUrl" character varying, "photoIdUrl" character varying, "businessDocumentUrl" character varying, "otherDocumentsUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "biolinkId" uuid, "categoryId" integer, CONSTRAINT "REL_7392a9c15c525aed526c19a4c5" UNIQUE ("biolinkId"), CONSTRAINT "PK_f7e3a90ca384e71d6e2e93bb340" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "verificationId" uuid`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "UQ_d4c935e9f1437f2398b9432464a" UNIQUE ("verificationId")`);
        await queryRunner.query(`ALTER TABLE "verification" ADD CONSTRAINT "FK_8300048608d8721aea27747b07a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification" ADD CONSTRAINT "FK_7392a9c15c525aed526c19a4c5c" FOREIGN KEY ("biolinkId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verification" ADD CONSTRAINT "FK_5416fe55dabbd4e366b8e46a5c1" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "FK_d4c935e9f1437f2398b9432464a" FOREIGN KEY ("verificationId") REFERENCES "verification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "FK_d4c935e9f1437f2398b9432464a"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP CONSTRAINT "FK_5416fe55dabbd4e366b8e46a5c1"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP CONSTRAINT "FK_7392a9c15c525aed526c19a4c5c"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP CONSTRAINT "FK_8300048608d8721aea27747b07a"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "UQ_d4c935e9f1437f2398b9432464a"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "verificationId"`);
        await queryRunner.query(`DROP TABLE "verification"`);
        await queryRunner.query(`DROP TYPE "verification_verificationstatus_enum"`);
    }

}
