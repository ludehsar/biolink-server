import {MigrationInterface, QueryRunner} from "typeorm";

export class PopulateSettingsKeys1618713696923 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO "settings" ("key") VALUES ('main')`);
        await queryRunner.query(`INSERT INTO "settings" ("key") VALUES ('links')`);
        await queryRunner.query(`INSERT INTO "settings" ("key") VALUES ('payments')`);
        await queryRunner.query(`INSERT INTO "settings" ("key") VALUES ('business')`);
        await queryRunner.query(`INSERT INTO "settings" ("key") VALUES ('captcha')`);
        await queryRunner.query(`INSERT INTO "settings" ("key") VALUES ('facebook_login')`);
        await queryRunner.query(`INSERT INTO "settings" ("key") VALUES ('ads')`);
        await queryRunner.query(`INSERT INTO "settings" ("key") VALUES ('socials')`);
        await queryRunner.query(`INSERT INTO "settings" ("key") VALUES ('email')`);
        await queryRunner.query(`INSERT INTO "settings" ("key") VALUES ('email_notification')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "settings" WHERE "key" = 'main'`);
        await queryRunner.query(`DELETE FROM "settings" WHERE "key" = 'links'`);
        await queryRunner.query(`DELETE FROM "settings" WHERE "key" = 'payments'`);
        await queryRunner.query(`DELETE FROM "settings" WHERE "key" = 'business'`);
        await queryRunner.query(`DELETE FROM "settings" WHERE "key" = 'captcha'`);
        await queryRunner.query(`DELETE FROM "settings" WHERE "key" = 'facebook_login'`);
        await queryRunner.query(`DELETE FROM "settings" WHERE "key" = 'ads'`);
        await queryRunner.query(`DELETE FROM "settings" WHERE "key" = 'socials'`);
        await queryRunner.query(`DELETE FROM "settings" WHERE "key" = 'email'`);
        await queryRunner.query(`DELETE FROM "settings" WHERE "key" = 'email_notification'`);
    }

}
