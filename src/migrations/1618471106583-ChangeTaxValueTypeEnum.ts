import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeTaxValueTypeEnum1618471106583 implements MigrationInterface {
    name = 'ChangeTaxValueTypeEnum1618471106583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "tax_valuetype_enum" RENAME TO "tax_valuetype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "tax_valuetype_enum" AS ENUM('Percentage', 'Fixed')`);
        await queryRunner.query(`ALTER TABLE "tax" ALTER COLUMN "valueType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tax" ALTER COLUMN "valueType" TYPE "tax_valuetype_enum" USING "valueType"::"text"::"tax_valuetype_enum"`);
        await queryRunner.query(`ALTER TABLE "tax" ALTER COLUMN "valueType" SET DEFAULT 'Fixed'`);
        await queryRunner.query(`DROP TYPE "tax_valuetype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "tax_valuetype_enum_old" AS ENUM('Discount')`);
        await queryRunner.query(`ALTER TABLE "tax" ALTER COLUMN "valueType" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "tax" ALTER COLUMN "valueType" TYPE "tax_valuetype_enum_old" USING "valueType"::"text"::"tax_valuetype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "tax" ALTER COLUMN "valueType" SET DEFAULT 'Discount'`);
        await queryRunner.query(`DROP TYPE "tax_valuetype_enum"`);
        await queryRunner.query(`ALTER TYPE "tax_valuetype_enum_old" RENAME TO "tax_valuetype_enum"`);
    }

}
