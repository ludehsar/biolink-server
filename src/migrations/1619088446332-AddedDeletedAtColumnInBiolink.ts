import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedDeletedAtColumnInBiolink1619088446332 implements MigrationInterface {
    name = 'AddedDeletedAtColumnInBiolink1619088446332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "deletedAt"`);
    }

}
