import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedAttributesToBlackList1618200998171 implements MigrationInterface {
    name = 'AddedAttributesToBlackList1618200998171'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "black_list" ADD "username" character varying`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD CONSTRAINT "UQ_f1192ca026dfbe58a89752ae84b" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD "badWords" character varying`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD CONSTRAINT "UQ_8adc81431074f505fa8d980802c" UNIQUE ("badWords")`);
        await queryRunner.query(`ALTER TABLE "black_list" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "black_list" ALTER COLUMN "reason" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "visibilityStatus" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plan" ALTER COLUMN "visibilityStatus" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "black_list" ALTER COLUMN "reason" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "black_list" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP CONSTRAINT "UQ_8adc81431074f505fa8d980802c"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP COLUMN "badWords"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP CONSTRAINT "UQ_f1192ca026dfbe58a89752ae84b"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP COLUMN "username"`);
    }

}
