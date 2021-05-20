import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedTrackingUserRegistrationByCode1621493964932 implements MigrationInterface {
    name = 'AddedTrackingUserRegistrationByCode1621493964932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "registeredByCodeId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3fb14124b42809e57cd35bce0a4" FOREIGN KEY ("registeredByCodeId") REFERENCES "code"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3fb14124b42809e57cd35bce0a4"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "registeredByCodeId"`);
    }

}
