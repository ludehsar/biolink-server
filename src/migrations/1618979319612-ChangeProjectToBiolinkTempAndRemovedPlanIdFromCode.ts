import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeProjectToBiolinkTempAndRemovedPlanIdFromCode1618979319612 implements MigrationInterface {
    name = 'ChangeProjectToBiolinkTempAndRemovedPlanIdFromCode1618979319612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_531b91b9ed78f3481ac91659d3e"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_6e67a324a44ab9d886bf717fab8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_4dd13cf5536c5ec906dba37cbef"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_767fd655f1726d51e909cb97cf0"`);
        await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_4e09f44619496cac4210efce311"`);
        await queryRunner.query(`ALTER TABLE "track_link" RENAME COLUMN "projectId" TO "biolinkId"`);
        await queryRunner.query(`CREATE TABLE "biolink_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectName" character varying NOT NULL, "username" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "categoryId" integer, CONSTRAINT "UQ_59a429f2c9eb4484ee2f473348c" UNIQUE ("username"), CONSTRAINT "PK_9094cf25850ddb17d73483ab5ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "biolinkId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "code" DROP COLUMN "planId"`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_ffa1c558472efd7b6ab029e584e" FOREIGN KEY ("biolinkId") REFERENCES "biolink_temp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink_temp" ADD CONSTRAINT "FK_e5eab6672fbb86db632e5ed635b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink_temp" ADD CONSTRAINT "FK_8cb8833ccec599c90f7fd0dc5da" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink_temp" DROP CONSTRAINT "FK_8cb8833ccec599c90f7fd0dc5da"`);
        await queryRunner.query(`ALTER TABLE "biolink_temp" DROP CONSTRAINT "FK_e5eab6672fbb86db632e5ed635b"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_ffa1c558472efd7b6ab029e584e"`);
        await queryRunner.query(`ALTER TABLE "code" ADD "planId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "link" ADD "biolinkId" uuid`);
        await queryRunner.query(`ALTER TABLE "link" ADD "projectId" uuid`);
        await queryRunner.query(`DROP TABLE "biolink_temp"`);
        await queryRunner.query(`ALTER TABLE "track_link" RENAME COLUMN "biolinkId" TO "projectId"`);
        await queryRunner.query(`ALTER TABLE "code" ADD CONSTRAINT "FK_4e09f44619496cac4210efce311" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_767fd655f1726d51e909cb97cf0" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_4dd13cf5536c5ec906dba37cbef" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_6e67a324a44ab9d886bf717fab8" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_531b91b9ed78f3481ac91659d3e" FOREIGN KEY ("biolinkId") REFERENCES "link"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
