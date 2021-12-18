import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedNameFieldInUsersTable1639798438669 implements MigrationInterface {
    name = 'AddedNameFieldInUsersTable1639798438669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user" DROP COLUMN "name"`);
    }

}
