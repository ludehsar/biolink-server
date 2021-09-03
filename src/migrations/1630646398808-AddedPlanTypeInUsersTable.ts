import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedPlanTypeInUsersTable1630646398808 implements MigrationInterface {
    name = 'AddedPlanTypeInUsersTable1630646398808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "user_plantype_enum" AS ENUM('Free', 'Monthly', 'Annual')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "planType" "user_plantype_enum" DEFAULT 'Free'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "planType"`);
        await queryRunner.query(`DROP TYPE "user_plantype_enum"`);
    }

}
