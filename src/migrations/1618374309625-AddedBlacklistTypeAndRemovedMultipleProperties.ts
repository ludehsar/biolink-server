import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedBlacklistTypeAndRemovedMultipleProperties1618374309625 implements MigrationInterface {
    name = 'AddedBlacklistTypeAndRemovedMultipleProperties1618374309625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "black_list" DROP CONSTRAINT "UQ_9650035f789e40cb2f917613eab"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP CONSTRAINT "UQ_f1192ca026dfbe58a89752ae84b"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP CONSTRAINT "UQ_8adc81431074f505fa8d980802c"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP COLUMN "badWords"`);
        await queryRunner.query(`CREATE TYPE "black_list_blacklisttype_enum" AS ENUM('Email', 'Username', 'BadWord')`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD "blacklistType" "black_list_blacklisttype_enum" NOT NULL DEFAULT 'BadWord'`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD "keyword" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD CONSTRAINT "UQ_6d45b0e085cdea0bdfaf7d1ba41" UNIQUE ("blacklistType", "keyword")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "black_list" DROP CONSTRAINT "UQ_6d45b0e085cdea0bdfaf7d1ba41"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP COLUMN "keyword"`);
        await queryRunner.query(`ALTER TABLE "black_list" DROP COLUMN "blacklistType"`);
        await queryRunner.query(`DROP TYPE "black_list_blacklisttype_enum"`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD "badWords" character varying`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD CONSTRAINT "UQ_8adc81431074f505fa8d980802c" UNIQUE ("badWords")`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD "username" character varying`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD CONSTRAINT "UQ_f1192ca026dfbe58a89752ae84b" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "black_list" ADD CONSTRAINT "UQ_9650035f789e40cb2f917613eab" UNIQUE ("email")`);
    }

}
