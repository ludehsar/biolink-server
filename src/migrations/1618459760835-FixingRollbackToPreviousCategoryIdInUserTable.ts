import {MigrationInterface, QueryRunner} from "typeorm";

export class FixingRollbackToPreviousCategoryIdInUserTable1618459760835 implements MigrationInterface {
    name = 'FixingRollbackToPreviousCategoryIdInUserTable1618459760835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c22adcb15e7de70e1a74b4a3542"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "category_id" TO "categoryId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_4dd13cf5536c5ec906dba37cbef" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_4dd13cf5536c5ec906dba37cbef"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "categoryId" TO "category_id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c22adcb15e7de70e1a74b4a3542" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
