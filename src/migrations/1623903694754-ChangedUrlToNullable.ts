import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedUrlToNullable1623903694754 implements MigrationInterface {
    name = 'ChangedUrlToNullable1623903694754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "url" SET NOT NULL`);
    }

}
