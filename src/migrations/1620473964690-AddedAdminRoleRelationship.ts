import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedAdminRoleRelationship1620473964690 implements MigrationInterface {
    name = 'AddedAdminRoleRelationship1620473964690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_role" ("id" SERIAL NOT NULL, "roleName" character varying NOT NULL, "roleDescription" character varying, "roleSettings" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3afb17d33a68887b92dd425ac46" UNIQUE ("roleName"), CONSTRAINT "PK_fd32421f2d93414e46a8fcfd86b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "adminRoleId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3a7597c7b3d26470efb7c2395d4" FOREIGN KEY ("adminRoleId") REFERENCES "admin_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3a7597c7b3d26470efb7c2395d4"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "adminRoleId"`);
        await queryRunner.query(`DROP TABLE "admin_role"`);
    }

}
