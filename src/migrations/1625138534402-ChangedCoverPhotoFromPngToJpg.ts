import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedCoverPhotoFromPngToJpg1625138534402 implements MigrationInterface {
    name = 'ChangedCoverPhotoFromPngToJpg1625138534402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" ALTER COLUMN "coverPhotoUrl" SET DEFAULT 'http://localhost:4000/static/defaultCoverPhoto.jpg'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" ALTER COLUMN "coverPhotoUrl" SET DEFAULT 'http://localhost:4000/static/defaultCoverPhoto.png'`);
    }

}
