import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedVerificationDetailsToBiolinkAndVerification1623323216524 implements MigrationInterface {
    name = 'AddedVerificationDetailsToBiolinkAndVerification1623323216524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" ADD "verifiedGovernmentId" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "verifiedEmail" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "verifiedPhoneNumber" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD "verifiedWorkEmail" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "verifiedGovernmentId" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "verifiedEmail" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "verifiedPhoneNumber" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "verification" ADD "verifiedWorkEmail" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "verifiedWorkEmail"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "verifiedPhoneNumber"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "verifiedEmail"`);
        await queryRunner.query(`ALTER TABLE "verification" DROP COLUMN "verifiedGovernmentId"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "verifiedWorkEmail"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "verifiedPhoneNumber"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "verifiedEmail"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "verifiedGovernmentId"`);
    }

}
