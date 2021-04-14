import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedUserIDPropertyForProjectTable1618404924811 implements MigrationInterface {
    name = 'ChangedUserIDPropertyForProjectTable1618404924811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_1cf56b10b23971cfd07e4fc6126" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_1cf56b10b23971cfd07e4fc6126"`);
        await queryRunner.query(`ALTER TABLE "project" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
