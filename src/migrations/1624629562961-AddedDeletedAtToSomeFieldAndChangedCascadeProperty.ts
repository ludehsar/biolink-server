import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedDeletedAtToSomeFieldAndChangedCascadeProperty1624629562961 implements MigrationInterface {
    name = 'AddedDeletedAtToSomeFieldAndChangedCascadeProperty1624629562961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "domain" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "support" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "admin_role" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin_role" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "domain" DROP COLUMN "deletedAt"`);
    }

}
