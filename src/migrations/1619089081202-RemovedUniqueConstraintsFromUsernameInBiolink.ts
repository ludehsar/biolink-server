import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedUniqueConstraintsFromUsernameInBiolink1619089081202 implements MigrationInterface {
    name = 'RemovedUniqueConstraintsFromUsernameInBiolink1619089081202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "UQ_169e8c8d3b044c00bea1630b282"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "UQ_2c53499f3b4932b85f4cf2e44ff"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "UQ_169e8c8d3b044c00bea1630b282" UNIQUE ("username", "deletedAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "UQ_169e8c8d3b044c00bea1630b282"`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "UQ_2c53499f3b4932b85f4cf2e44ff" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "UQ_169e8c8d3b044c00bea1630b282" UNIQUE ("username", "deletedAt")`);
    }

}
