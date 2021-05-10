import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSuperAdminToTheAdminRoleTable1620559933285 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "admin_role"
            ("roleName", "roleDescription") VALUES
            (
                'Administrator',
                'This is the highest priviledged role a user can have. A user with this role can create, modify, and permanently remove any records.'
            )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "admin_role" WHERE "roleName" = 'Administrator'`);
    }

}
