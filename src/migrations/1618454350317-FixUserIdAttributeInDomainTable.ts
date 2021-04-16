import {MigrationInterface, QueryRunner} from "typeorm";

export class FixUserIdAttributeInDomainTable1618454350317 implements MigrationInterface {
    name = 'FixUserIdAttributeInDomainTable1618454350317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "domain" DROP CONSTRAINT "FK_62091e8dd70081e0e8b24d1ac8b"`);
        await queryRunner.query(`ALTER TABLE "domain" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "domain" ADD CONSTRAINT "FK_dde349027ada546b854e9fdb5fc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "domain" DROP CONSTRAINT "FK_dde349027ada546b854e9fdb5fc"`);
        await queryRunner.query(`ALTER TABLE "domain" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "domain" ADD CONSTRAINT "FK_62091e8dd70081e0e8b24d1ac8b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}