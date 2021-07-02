import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedLinkImageUrl1625235922526 implements MigrationInterface {
    name = 'ChangedLinkImageUrl1625235922526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "linkImageUrl" SET DEFAULT 'http://localhost:4000/static/defaultLinkImage.jpg'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "linkImageUrl" DROP DEFAULT`);
    }

}
