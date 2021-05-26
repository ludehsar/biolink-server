import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedNameFieldFromUserTable1622007722775 implements MigrationInterface {
    name = 'RemovedNameFieldFromUserTable1622007722775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`);
    }

}
