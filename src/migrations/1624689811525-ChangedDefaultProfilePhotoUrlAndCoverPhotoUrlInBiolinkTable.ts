import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedDefaultProfilePhotoUrlAndCoverPhotoUrlInBiolinkTable1624689811525 implements MigrationInterface {
    name = 'ChangedDefaultProfilePhotoUrlAndCoverPhotoUrlInBiolinkTable1624689811525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "username" DROP CONSTRAINT "FK_cf5379446c7770ce52819823aa6"`);
        await queryRunner.query(`ALTER TABLE "username" ADD CONSTRAINT "UQ_cf5379446c7770ce52819823aa6" UNIQUE ("biolinkId")`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "UQ_286f699402052a53ca1b589caae"`);
        await queryRunner.query(`ALTER TABLE "biolink" ALTER COLUMN "profilePhotoUrl" SET DEFAULT 'http://localhost:4000/static/defaultProfilePhoto.png'`);
        await queryRunner.query(`ALTER TABLE "biolink" ALTER COLUMN "coverPhotoUrl" SET DEFAULT 'http://localhost:4000/static/defaultCoverPhoto.png'`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "UQ_8c08ae439ea48b8fa5efd17c369" UNIQUE ("usernameId")`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "UQ_286f699402052a53ca1b589caae" UNIQUE ("usernameId", "deletedAt")`);
        await queryRunner.query(`ALTER TABLE "username" ADD CONSTRAINT "FK_cf5379446c7770ce52819823aa6" FOREIGN KEY ("biolinkId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369"`);
        await queryRunner.query(`ALTER TABLE "username" DROP CONSTRAINT "FK_cf5379446c7770ce52819823aa6"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "UQ_286f699402052a53ca1b589caae"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "UQ_8c08ae439ea48b8fa5efd17c369"`);
        await queryRunner.query(`ALTER TABLE "biolink" ALTER COLUMN "coverPhotoUrl" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "biolink" ALTER COLUMN "profilePhotoUrl" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "UQ_286f699402052a53ca1b589caae" UNIQUE ("deletedAt", "usernameId")`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "username" DROP CONSTRAINT "UQ_cf5379446c7770ce52819823aa6"`);
        await queryRunner.query(`ALTER TABLE "username" ADD CONSTRAINT "FK_cf5379446c7770ce52819823aa6" FOREIGN KEY ("biolinkId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
