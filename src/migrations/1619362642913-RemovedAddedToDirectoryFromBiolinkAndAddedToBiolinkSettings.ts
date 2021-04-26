import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedAddedToDirectoryFromBiolinkAndAddedToBiolinkSettings1619362642913 implements MigrationInterface {
    name = 'RemovedAddedToDirectoryFromBiolinkAndAddedToBiolinkSettings1619362642913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP COLUMN "addedToDirectory"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" ADD "addedToDirectory" boolean NOT NULL DEFAULT false`);
    }

}
