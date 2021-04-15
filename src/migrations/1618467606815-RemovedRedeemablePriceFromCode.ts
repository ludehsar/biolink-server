import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedRedeemablePriceFromCode1618467606815 implements MigrationInterface {
    name = 'RemovedRedeemablePriceFromCode1618467606815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code" DROP COLUMN "redeemablePrice"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code" ADD "redeemablePrice" integer DEFAULT '0'`);
    }

}
