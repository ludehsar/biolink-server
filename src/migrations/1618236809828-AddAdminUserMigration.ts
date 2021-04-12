import {MigrationInterface, QueryRunner} from "typeorm";
import dotenv from 'dotenv';
import * as argon2 from 'argon2';

dotenv.config();

export class AddAdminUserMigration1618236809828 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const adminPassword = process.env.ADMIN_PASSWORD as string
        const encryptedPassword = await argon2.hash(adminPassword)
        await queryRunner.query(`INSERT INTO "user" ("email", "username", "encryptedPassword", "userRole") VALUES ('rashedulalam112112@gmail.com', 'Rashedul_Alam', '${encryptedPassword}', 'Admin')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "user" WHERE "username" = 'Rashedul_Alam'`);
    }

}
