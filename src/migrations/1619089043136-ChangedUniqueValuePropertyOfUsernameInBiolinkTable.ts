import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedUniqueValuePropertyOfUsernameInBiolinkTable1619089043136 implements MigrationInterface {
    name = 'ChangedUniqueValuePropertyOfUsernameInBiolinkTable1619089043136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "UQ_169e8c8d3b044c00bea1630b282" UNIQUE ("username", "deletedAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "UQ_169e8c8d3b044c00bea1630b282"`);
    }

}
