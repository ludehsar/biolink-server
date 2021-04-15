import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangedUserIDForeignKeyAttributesToDomainTable1618454291793 implements MigrationInterface {
    name = 'ChangedUserIDForeignKeyAttributesToDomainTable1618454291793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "domain" DROP CONSTRAINT "FK_62091e8dd70081e0e8b24d1ac8b"`);
        await queryRunner.query(`ALTER TABLE "domain" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "domain" ADD CONSTRAINT "FK_62091e8dd70081e0e8b24d1ac8b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "domain" DROP CONSTRAINT "FK_62091e8dd70081e0e8b24d1ac8b"`);
        await queryRunner.query(`ALTER TABLE "domain" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "domain" ADD CONSTRAINT "FK_62091e8dd70081e0e8b24d1ac8b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
