import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedCreatedUpdatedDeletedAtDatesAndChangedIdTypeToUUIDInServiceAndOrderTable1635483528093 implements MigrationInterface {
    name = 'AddedCreatedUpdatedDeletedAtDatesAndChangedIdTypeToUUIDInServiceAndOrderTable1635483528093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."service" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."service" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."service" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP CONSTRAINT "FK_c721e93645fdc15f040096d1eaa"`);
        await queryRunner.query(`ALTER TABLE "public"."service" DROP CONSTRAINT "PK_85a21558c006647cd76fdce044b"`);
        await queryRunner.query(`ALTER TABLE "public"."service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."service" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."service" ADD CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP CONSTRAINT "PK_1031171c13130102495201e3e20"`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD "serviceId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD CONSTRAINT "FK_c721e93645fdc15f040096d1eaa" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."order" DROP CONSTRAINT "FK_c721e93645fdc15f040096d1eaa"`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD "serviceId" integer`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP CONSTRAINT "PK_1031171c13130102495201e3e20"`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "public"."service" DROP CONSTRAINT "PK_85a21558c006647cd76fdce044b"`);
        await queryRunner.query(`ALTER TABLE "public"."service" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "public"."service" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."service" ADD CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "public"."order" ADD CONSTRAINT "FK_c721e93645fdc15f040096d1eaa" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."order" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "public"."service" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."service" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "public"."service" DROP COLUMN "createdAt"`);
    }

}
