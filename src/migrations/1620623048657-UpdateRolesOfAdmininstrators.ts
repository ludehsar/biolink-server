import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateRolesOfAdmininstrators1620623048657 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "admin_role" SET "roleSettings" = '[{"canShow":"true","canEdit":"true","resource":"Biolink","canCreate":"true","canDelete":"true","canShowList":"true"},{"canShow":"true","canEdit":"true","resource":"Black List","canCreate":"true","canDelete":"true","canShowList":"true"},{"canShow":"true","canEdit":"true","resource":"Category","canCreate":"true","canDelete":"true","canShowList":"true"},{"canShow":"true","canEdit":"true","resource":"Code","canCreate":"true","canDelete":"true","canShowList":"true"},{"canShow":"true","canEdit":"true","resource":"Domain","canCreate":"true","canDelete":"true","canShowList":"true"},{"canShow":"true","canEdit":"true","resource":"Link","canCreate":"true","canDelete":"true","canShowList":"true"},{"canShow":"true","canEdit":"true","resource":"Plan","canCreate":"true","canDelete":"true","canShowList":"true"},{"canShow":"true","canEdit":"true","resource":"Premium Username","canCreate":"true","canDelete":"true","canShowList":"true"},{"canShow":"true","canEdit":"true","resource":"Tax","canCreate":"true","canDelete":"true","canShowList":"true"},{"canShow":"true","canEdit":"true","resource":"User","canCreate":"true","canDelete":"true","canShowList":"true"},{"canShow":"true","canEdit":"true","resource":"Verification","canCreate":"true","canDelete":"true","canShowList":"true"}]' WHERE "roleName" = 'Administrator'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "admin_role" SET "roleSettings" = NULL WHERE "roleName" = 'Administrator'`)
    }

}
