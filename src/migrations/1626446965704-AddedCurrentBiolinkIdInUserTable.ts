import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedCurrentBiolinkIdInUserTable1626446965704 implements MigrationInterface {
    name = 'AddedCurrentBiolinkIdInUserTable1626446965704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "currentBiolinkId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "currentBiolinkId"`);
    }

}
