import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedProjectNameFromBiolink1618980148928 implements MigrationInterface {
    name = 'RemovedProjectNameFromBiolink1618980148928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "projectName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" ADD "projectName" character varying NOT NULL`);
    }

}
