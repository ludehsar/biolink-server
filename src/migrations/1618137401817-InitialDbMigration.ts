import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialDbMigration1618137401817 implements MigrationInterface {
    name = 'InitialDbMigration1618137401817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tax" ("id" SERIAL NOT NULL, "internalName" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "value" integer NOT NULL DEFAULT '20', "valueType" "tax_valuetype_enum" NOT NULL DEFAULT 'Discount', "type" "tax_type_enum" NOT NULL DEFAULT 'Inclusive', "billingFor" "tax_billingfor_enum" NOT NULL DEFAULT 'Personal & Business', "countries" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2c1e62c595571139e2fb0e9c319" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "domain" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheme" "domain_scheme_enum" NOT NULL DEFAULT 'https', "host" character varying NOT NULL, "customIndexUrl" character varying, "enabledStatus" "domain_enabledstatus_enum" NOT NULL DEFAULT 'Disabled', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_27e3ec3ea0ae02c8c5bceab3ba9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "link" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheme" "link_scheme_enum" NOT NULL DEFAULT 'Link', "url" character varying NOT NULL, "clicks" integer NOT NULL DEFAULT '0', "settings" json, "order" integer NOT NULL DEFAULT '0', "startDate" date, "endDate" date, "status" "link_status_enum" NOT NULL DEFAULT 'Disabled', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "projectId" uuid, "biolinkId" uuid, CONSTRAINT "PK_26206fb7186da72fbb9eaa3fac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "emailVerifiedAt" date, "emailActivationCode" character varying, "encryptedPassword" character varying NOT NULL, "forgotPasswordCode" character varying, "name" character varying, "userRole" "user_userrole_enum" NOT NULL DEFAULT 'User', "billing" json, "facebookId" character varying, "planExpirationDate" date, "planTrialDone" boolean NOT NULL DEFAULT false, "paymentSubscriptionId" character varying, "country" character varying, "totalLogin" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "planId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_67f5b68a05c3ded5f1123742d4e" UNIQUE ("emailActivationCode"), CONSTRAINT "UQ_7aa69905302b42689211f9bb91e" UNIQUE ("forgotPasswordCode"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plan" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "monthlyPriceEnabled" boolean NOT NULL DEFAULT false, "monthlyPrice" double precision NOT NULL DEFAULT '0', "annualPriceEnabled" boolean NOT NULL DEFAULT false, "annualPrice" double precision NOT NULL DEFAULT '0', "lifetimePriceEnabled" boolean NOT NULL DEFAULT false, "lifetimePrice" double precision NOT NULL DEFAULT '0', "settings" json, "enabledStatus" "plan_enabledstatus_enum" NOT NULL DEFAULT 'Disabled', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab" UNIQUE ("name"), CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "code_type_enum" NOT NULL DEFAULT 'Discount', "code" character varying NOT NULL, "discount" integer DEFAULT '0', "redeemablePrice" integer DEFAULT '0', "quantity" integer DEFAULT '0', "expireDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "planId" integer, CONSTRAINT "UQ_3aab60cbcf5684b4a89fb46147e" UNIQUE ("code"), CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "page" ("id" SERIAL NOT NULL, "type" "page_type_enum" NOT NULL DEFAULT 'Internal', "externalUrl" character varying, "title" character varying NOT NULL, "slug" character varying, "content" character varying, "shortDescription" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6eb7269e2ff9f7d06893acebf16" UNIQUE ("title"), CONSTRAINT "UQ_875a4ba4aebdc1855dbf176dadb" UNIQUE ("slug"), CONSTRAINT "PK_742f4117e065c5b6ad21b37ba1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" json, CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tax_plans_plan" ("taxId" integer NOT NULL, "planId" integer NOT NULL, CONSTRAINT "PK_8d7079943b022941a1f27796058" PRIMARY KEY ("taxId", "planId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8bc0cb424d4e7c6d716ddf04d8" ON "tax_plans_plan" ("taxId") `);
        await queryRunner.query(`CREATE INDEX "IDX_97d49a02bf73d22af08c692423" ON "tax_plans_plan" ("planId") `);
        await queryRunner.query(`ALTER TABLE "domain" ADD CONSTRAINT "FK_dde349027ada546b854e9fdb5fc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_6e67a324a44ab9d886bf717fab8" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_531b91b9ed78f3481ac91659d3e" FOREIGN KEY ("biolinkId") REFERENCES "link"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "code" ADD CONSTRAINT "FK_4e09f44619496cac4210efce311" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tax_plans_plan" ADD CONSTRAINT "FK_8bc0cb424d4e7c6d716ddf04d85" FOREIGN KEY ("taxId") REFERENCES "tax"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tax_plans_plan" ADD CONSTRAINT "FK_97d49a02bf73d22af08c692423a" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tax_plans_plan" DROP CONSTRAINT "FK_97d49a02bf73d22af08c692423a"`);
        await queryRunner.query(`ALTER TABLE "tax_plans_plan" DROP CONSTRAINT "FK_8bc0cb424d4e7c6d716ddf04d85"`);
        await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_4e09f44619496cac4210efce311"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_531b91b9ed78f3481ac91659d3e"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_6e67a324a44ab9d886bf717fab8"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0"`);
        await queryRunner.query(`ALTER TABLE "domain" DROP CONSTRAINT "FK_dde349027ada546b854e9fdb5fc"`);
        await queryRunner.query(`DROP INDEX "IDX_97d49a02bf73d22af08c692423"`);
        await queryRunner.query(`DROP INDEX "IDX_8bc0cb424d4e7c6d716ddf04d8"`);
        await queryRunner.query(`DROP TABLE "tax_plans_plan"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "page"`);
        await queryRunner.query(`DROP TABLE "code"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "link"`);
        await queryRunner.query(`DROP TABLE "domain"`);
        await queryRunner.query(`DROP TABLE "tax"`);
    }

}
