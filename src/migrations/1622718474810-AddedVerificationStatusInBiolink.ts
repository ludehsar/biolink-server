import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedVerificationStatusInBiolink1622718474810 implements MigrationInterface {
    name = 'AddedVerificationStatusInBiolink1622718474810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "biolink_verificationstatus_enum" AS ENUM('Not Applied', 'Pending', 'Verified', 'Rejected')`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "verificationStatus" "biolink_verificationstatus_enum" DEFAULT 'Not Applied'`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "link" ADD "password" text`);
        await queryRunner.query(`ALTER TYPE "verification_verificationstatus_enum" RENAME TO "verification_verificationstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "verification_verificationstatus_enum" AS ENUM('Not Applied', 'Pending', 'Verified', 'Rejected')`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "verificationStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "verificationStatus" TYPE "verification_verificationstatus_enum" USING "verificationStatus"::"text"::"verification_verificationstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "verificationStatus" SET DEFAULT 'Pending'`);
        await queryRunner.query(`DROP TYPE "verification_verificationstatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "verification_verificationstatus_enum_old" AS ENUM('Pending', 'Verified', 'Rejected')`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "verificationStatus" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "verificationStatus" TYPE "verification_verificationstatus_enum_old" USING "verificationStatus"::"text"::"verification_verificationstatus_enum_old"`);
        await queryRunner.query(`ALTER TABLE "verification" ALTER COLUMN "verificationStatus" SET DEFAULT 'Pending'`);
        await queryRunner.query(`DROP TYPE "verification_verificationstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "verification_verificationstatus_enum_old" RENAME TO "verification_verificationstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "link" ADD "password" character varying`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "verificationStatus"`);
        await queryRunner.query(`DROP TYPE "biolink_verificationstatus_enum"`);
    }

}
