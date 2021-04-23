import {MigrationInterface, QueryRunner} from "typeorm";

export class MadeShortenedUrlUniqueInLinksTable1619186580673 implements MigrationInterface {
    name = 'MadeShortenedUrlUniqueInLinksTable1619186580673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "UQ_d0d8043be438496bc31c73e9ed5" UNIQUE ("shortenedUrl")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "UQ_d0d8043be438496bc31c73e9ed5"`);
    }

}
