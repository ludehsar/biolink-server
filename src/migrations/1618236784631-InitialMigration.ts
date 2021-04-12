import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1618236784631 implements MigrationInterface {
    name = 'InitialMigration1618236784631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "black_list" ("id" SERIAL NOT NULL, "email" character varying, "username" character varying, "badWords" character varying, "reason" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9650035f789e40cb2f917613eab" UNIQUE ("email"), CONSTRAINT "UQ_f1192ca026dfbe58a89752ae84b" UNIQUE ("username"), CONSTRAINT "UQ_8adc81431074f505fa8d980802c" UNIQUE ("badWords"), CONSTRAINT "PK_6969ca1c62bdf4fef47a85b8195" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "domain_scheme_enum" AS ENUM('http', 'https')`);
        await queryRunner.query(`CREATE TYPE "domain_enabledstatus_enum" AS ENUM('Enabled', 'Disabled')`);
        await queryRunner.query(`CREATE TABLE "domain" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheme" "domain_scheme_enum" NOT NULL DEFAULT 'https', "host" character varying NOT NULL, "customIndexUrl" character varying, "enabledStatus" "domain_enabledstatus_enum" NOT NULL DEFAULT 'Disabled', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_27e3ec3ea0ae02c8c5bceab3ba9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "code_type_enum" AS ENUM('Discount', 'Redeemable')`);
        await queryRunner.query(`CREATE TABLE "code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "code_type_enum" NOT NULL DEFAULT 'Discount', "code" character varying NOT NULL, "discount" integer DEFAULT '0', "redeemablePrice" integer DEFAULT '0', "quantity" integer DEFAULT '0', "expireDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "planId" integer, CONSTRAINT "UQ_3aab60cbcf5684b4a89fb46147e" UNIQUE ("code"), CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "tax_valuetype_enum" AS ENUM('Discount')`);
        await queryRunner.query(`CREATE TYPE "tax_type_enum" AS ENUM('Inclusive', 'Exclusive')`);
        await queryRunner.query(`CREATE TYPE "tax_billingfor_enum" AS ENUM('Personal', 'Business', 'Personal & Business')`);
        await queryRunner.query(`CREATE TABLE "tax" ("id" SERIAL NOT NULL, "internalName" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "value" integer NOT NULL DEFAULT '20', "valueType" "tax_valuetype_enum" NOT NULL DEFAULT 'Discount', "type" "tax_type_enum" NOT NULL DEFAULT 'Inclusive', "billingFor" "tax_billingfor_enum" NOT NULL DEFAULT 'Personal & Business', "countries" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2c1e62c595571139e2fb0e9c319" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "plan_enabledstatus_enum" AS ENUM('Enabled', 'Disabled')`);
        await queryRunner.query(`CREATE TABLE "plan" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "monthlyPriceEnabled" boolean NOT NULL DEFAULT false, "monthlyPrice" double precision NOT NULL DEFAULT '0', "annualPriceEnabled" boolean NOT NULL DEFAULT false, "annualPrice" double precision NOT NULL DEFAULT '0', "lifetimePriceEnabled" boolean NOT NULL DEFAULT false, "lifetimePrice" double precision NOT NULL DEFAULT '0', "settings" json, "enabledStatus" "plan_enabledstatus_enum" NOT NULL DEFAULT 'Disabled', "visibilityStatus" boolean NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8aa73af67fa634d33de9bf874ab" UNIQUE ("name"), CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "track_link" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "countryCode" character varying, "cityName" character varying, "osName" character varying, "browserName" character varying, "referrerHost" character varying, "referrerPath" character varying, "deviceType" character varying, "browserLanguage" character varying, "utmSource" character varying, "utmMedium" character varying, "utmCampaign" character varying, "isUnique" boolean, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "linkId" uuid, "projectId" uuid, CONSTRAINT "PK_7d496873aeb9162f01a67967f7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "link_scheme_enum" AS ENUM('BioLink', 'Link')`);
        await queryRunner.query(`CREATE TYPE "link_status_enum" AS ENUM('Enabled', 'Disabled')`);
        await queryRunner.query(`CREATE TABLE "link" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scheme" "link_scheme_enum" NOT NULL DEFAULT 'Link', "url" character varying NOT NULL, "clicks" integer NOT NULL DEFAULT '0', "settings" json, "order" integer NOT NULL DEFAULT '0', "startDate" date, "endDate" date, "status" "link_status_enum" NOT NULL DEFAULT 'Disabled', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "projectId" uuid, "biolinkId" uuid, CONSTRAINT "PK_26206fb7186da72fbb9eaa3fac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "projectName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ipAddress" character varying, "type" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_773dbba6ad8ad2cdecfef243953" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "user_userrole_enum" AS ENUM('Admin', 'User')`);
        await queryRunner.query(`CREATE TYPE "user_activestatus_enum" AS ENUM('Active', 'Inactive')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "username" character varying NOT NULL, "emailVerifiedAt" date, "emailActivationCode" character varying, "encryptedPassword" character varying NOT NULL, "forgotPasswordCode" character varying, "name" character varying, "userRole" "user_userrole_enum" NOT NULL DEFAULT 'User', "billing" json, "tokenCode" character varying, "authenticatorSecret" character varying, "facebookId" character varying, "activeStatus" "user_activestatus_enum" NOT NULL DEFAULT 'Inactive', "planExpirationDate" date, "planTrialDone" boolean NOT NULL DEFAULT false, "paymentSubscriptionId" character varying, "language" character varying, "timezone" character varying, "lastIPAddress" character varying, "lastUserAgent" character varying, "country" character varying, "totalLogin" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "planId" integer, "categoryId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_67f5b68a05c3ded5f1123742d4e" UNIQUE ("emailActivationCode"), CONSTRAINT "UQ_7aa69905302b42689211f9bb91e" UNIQUE ("forgotPasswordCode"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "categoryName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cb776c7d842f8375b60273320dc" UNIQUE ("categoryName"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "page_type_enum" AS ENUM('Internal', 'External')`);
        await queryRunner.query(`CREATE TABLE "page" ("id" SERIAL NOT NULL, "type" "page_type_enum" NOT NULL DEFAULT 'Internal', "externalUrl" character varying, "title" character varying NOT NULL, "slug" character varying, "content" character varying, "shortDescription" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6eb7269e2ff9f7d06893acebf16" UNIQUE ("title"), CONSTRAINT "UQ_875a4ba4aebdc1855dbf176dadb" UNIQUE ("slug"), CONSTRAINT "PK_742f4117e065c5b6ad21b37ba1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "premium_username_usernametype_enum" AS ENUM('Premium', 'Trademark')`);
        await queryRunner.query(`CREATE TABLE "premium_username" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "price" integer NOT NULL, "usernameType" "premium_username_usernametype_enum" NOT NULL DEFAULT 'Premium', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" date, CONSTRAINT "UQ_495381b6ceaf57c97b696e6a0e4" UNIQUE ("username"), CONSTRAINT "PK_e34fa4c1788de9cbdd867fb21aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" json, CONSTRAINT "UQ_c8639b7626fa94ba8265628f214" UNIQUE ("key"), CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tax_plans_plan" ("taxId" integer NOT NULL, "planId" integer NOT NULL, CONSTRAINT "PK_8d7079943b022941a1f27796058" PRIMARY KEY ("taxId", "planId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8bc0cb424d4e7c6d716ddf04d8" ON "tax_plans_plan" ("taxId") `);
        await queryRunner.query(`CREATE INDEX "IDX_97d49a02bf73d22af08c692423" ON "tax_plans_plan" ("planId") `);
        await queryRunner.query(`ALTER TABLE "domain" ADD CONSTRAINT "FK_dde349027ada546b854e9fdb5fc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "code" ADD CONSTRAINT "FK_4e09f44619496cac4210efce311" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_3a9ae171c1eeda0c8b53f67ce52" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_0bb04d0ddd84ea9304e7beb4824" FOREIGN KEY ("linkId") REFERENCES "link"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_767fd655f1726d51e909cb97cf0" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_6e67a324a44ab9d886bf717fab8" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_531b91b9ed78f3481ac91659d3e" FOREIGN KEY ("biolinkId") REFERENCES "link"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_logs" ADD CONSTRAINT "FK_21c46c2b3ab66ef0773e5db3464" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_4dd13cf5536c5ec906dba37cbef" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tax_plans_plan" ADD CONSTRAINT "FK_8bc0cb424d4e7c6d716ddf04d85" FOREIGN KEY ("taxId") REFERENCES "tax"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tax_plans_plan" ADD CONSTRAINT "FK_97d49a02bf73d22af08c692423a" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tax_plans_plan" DROP CONSTRAINT "FK_97d49a02bf73d22af08c692423a"`);
        await queryRunner.query(`ALTER TABLE "tax_plans_plan" DROP CONSTRAINT "FK_8bc0cb424d4e7c6d716ddf04d85"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_4dd13cf5536c5ec906dba37cbef"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_40f6ab3925c167d26e52db93cf0"`);
        await queryRunner.query(`ALTER TABLE "user_logs" DROP CONSTRAINT "FK_21c46c2b3ab66ef0773e5db3464"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_7c4b0d3b77eaf26f8b4da879e63"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_531b91b9ed78f3481ac91659d3e"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_6e67a324a44ab9d886bf717fab8"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_767fd655f1726d51e909cb97cf0"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_0bb04d0ddd84ea9304e7beb4824"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_3a9ae171c1eeda0c8b53f67ce52"`);
        await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_4e09f44619496cac4210efce311"`);
        await queryRunner.query(`ALTER TABLE "domain" DROP CONSTRAINT "FK_dde349027ada546b854e9fdb5fc"`);
        await queryRunner.query(`DROP INDEX "IDX_97d49a02bf73d22af08c692423"`);
        await queryRunner.query(`DROP INDEX "IDX_8bc0cb424d4e7c6d716ddf04d8"`);
        await queryRunner.query(`DROP TABLE "tax_plans_plan"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "premium_username"`);
        await queryRunner.query(`DROP TYPE "premium_username_usernametype_enum"`);
        await queryRunner.query(`DROP TABLE "page"`);
        await queryRunner.query(`DROP TYPE "page_type_enum"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_activestatus_enum"`);
        await queryRunner.query(`DROP TYPE "user_userrole_enum"`);
        await queryRunner.query(`DROP TABLE "user_logs"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "link"`);
        await queryRunner.query(`DROP TYPE "link_status_enum"`);
        await queryRunner.query(`DROP TYPE "link_scheme_enum"`);
        await queryRunner.query(`DROP TABLE "track_link"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TYPE "plan_enabledstatus_enum"`);
        await queryRunner.query(`DROP TABLE "tax"`);
        await queryRunner.query(`DROP TYPE "tax_billingfor_enum"`);
        await queryRunner.query(`DROP TYPE "tax_type_enum"`);
        await queryRunner.query(`DROP TYPE "tax_valuetype_enum"`);
        await queryRunner.query(`DROP TABLE "code"`);
        await queryRunner.query(`DROP TYPE "code_type_enum"`);
        await queryRunner.query(`DROP TABLE "domain"`);
        await queryRunner.query(`DROP TYPE "domain_enabledstatus_enum"`);
        await queryRunner.query(`DROP TYPE "domain_scheme_enum"`);
        await queryRunner.query(`DROP TABLE "black_list"`);
    }

}
