import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedOwnerToPremiumUsername1619249363961 implements MigrationInterface {
    name = 'AddedOwnerToPremiumUsername1619249363961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "premium_username" ADD "ownerId" uuid`);
        await queryRunner.query(`ALTER TABLE "premium_username" ADD CONSTRAINT "FK_e160145992c002b6f95750667ab" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "premium_username" DROP CONSTRAINT "FK_e160145992c002b6f95750667ab"`);
        await queryRunner.query(`ALTER TABLE "premium_username" DROP COLUMN "ownerId"`);
    }

}
