import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedServicesAndOrdersSection1635261712732 implements MigrationInterface {
    name = 'AddedServicesAndOrdersSection1635261712732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "service" ("id" SERIAL NOT NULL, "title" character varying, "description" character varying, "blacklisted" boolean NOT NULL DEFAULT false, "price" double precision NOT NULL DEFAULT '0', "sellerId" uuid, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "description" character varying, "price" double precision NOT NULL DEFAULT '0', "orderCompleted" boolean NOT NULL DEFAULT false, "serviceId" integer, "buyerId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."biolink" DROP CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369"`);
        await queryRunner.query(`ALTER TABLE "public"."biolink" DROP CONSTRAINT "UQ_286f699402052a53ca1b589caae"`);
        await queryRunner.query(`ALTER TABLE "public"."biolink" ADD CONSTRAINT "UQ_8c08ae439ea48b8fa5efd17c369" UNIQUE ("usernameId")`);
        await queryRunner.query(`ALTER TABLE "public"."biolink" ADD CONSTRAINT "UQ_286f699402052a53ca1b589caae" UNIQUE ("usernameId", "deletedAt")`);
        await queryRunner.query(`ALTER TABLE "public"."biolink" ADD CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_53beaca8ac1de1f5b6a3ff7f492" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_c721e93645fdc15f040096d1eaa" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7" FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_20981b2b68bf03393c44dd1b9d7"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_c721e93645fdc15f040096d1eaa"`);
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_53beaca8ac1de1f5b6a3ff7f492"`);
        await queryRunner.query(`ALTER TABLE "public"."biolink" DROP CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369"`);
        await queryRunner.query(`ALTER TABLE "public"."biolink" DROP CONSTRAINT "UQ_286f699402052a53ca1b589caae"`);
        await queryRunner.query(`ALTER TABLE "public"."biolink" DROP CONSTRAINT "UQ_8c08ae439ea48b8fa5efd17c369"`);
        await queryRunner.query(`ALTER TABLE "public"."biolink" ADD CONSTRAINT "UQ_286f699402052a53ca1b589caae" UNIQUE ("deletedAt", "usernameId")`);
        await queryRunner.query(`ALTER TABLE "public"."biolink" ADD CONSTRAINT "FK_8c08ae439ea48b8fa5efd17c369" FOREIGN KEY ("usernameId") REFERENCES "username"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "service"`);
    }

}
