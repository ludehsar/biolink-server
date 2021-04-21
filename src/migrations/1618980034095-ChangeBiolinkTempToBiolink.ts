import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeBiolinkTempToBiolink1618980034095 implements MigrationInterface {
    name = 'ChangeBiolinkTempToBiolink1618980034095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_ffa1c558472efd7b6ab029e584e"`);
        await queryRunner.query(`CREATE TABLE "biolink" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectName" character varying NOT NULL, "username" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "categoryId" integer, CONSTRAINT "UQ_2c53499f3b4932b85f4cf2e44ff" UNIQUE ("username"), CONSTRAINT "PK_e8c9c2d68eb099d0f9982a2f3bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "link" ADD "biolinkId" uuid`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_ffa1c558472efd7b6ab029e584e" FOREIGN KEY ("biolinkId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_531b91b9ed78f3481ac91659d3e" FOREIGN KEY ("biolinkId") REFERENCES "biolink"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "FK_358886f258e623a560b46ff90c0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biolink" ADD CONSTRAINT "FK_02febfa734c6ab397e3477d9d04" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "FK_02febfa734c6ab397e3477d9d04"`);
        await queryRunner.query(`ALTER TABLE "biolink" DROP CONSTRAINT "FK_358886f258e623a560b46ff90c0"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_531b91b9ed78f3481ac91659d3e"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_ffa1c558472efd7b6ab029e584e"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "biolinkId"`);
        await queryRunner.query(`DROP TABLE "biolink"`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_ffa1c558472efd7b6ab029e584e" FOREIGN KEY ("biolinkId") REFERENCES "biolink_temp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
