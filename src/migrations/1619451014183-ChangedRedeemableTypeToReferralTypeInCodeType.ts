import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedRedeemableTypeToReferralTypeInCodeType1619451014183 implements MigrationInterface {
    name = 'ChangedRedeemableTypeToReferralTypeInCodeType1619451014183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "code_type_enum" RENAME TO "code_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "code_type_enum" AS ENUM('Discount', 'Referral')`);
        await queryRunner.query(`ALTER TABLE "code" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "code" ALTER COLUMN "type" TYPE "code_type_enum" USING "type"::"text"::"code_type_enum"`);
        await queryRunner.query(`ALTER TABLE "code" ALTER COLUMN "type" SET DEFAULT 'Discount'`);
        await queryRunner.query(`DROP TYPE "code_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "code_type_enum_old" AS ENUM('Discount', 'Redeemable')`);
        await queryRunner.query(`ALTER TABLE "code" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "code" ALTER COLUMN "type" TYPE "code_type_enum_old" USING "type"::"text"::"code_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "code" ALTER COLUMN "type" SET DEFAULT 'Discount'`);
        await queryRunner.query(`DROP TYPE "code_type_enum"`);
        await queryRunner.query(`ALTER TYPE "code_type_enum_old" RENAME TO "code_type_enum"`);
    }

}
