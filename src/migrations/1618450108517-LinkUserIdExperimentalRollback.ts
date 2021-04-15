import {MigrationInterface, QueryRunner} from "typeorm";

export class LinkUserIdExperimentalRollback1618450108517 implements MigrationInterface {
    name = 'LinkUserIdExperimentalRollback1618450108517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_da35233ec2bfaa121bb3540039b"`);
        await queryRunner.query(`ALTER TABLE "link" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_14a562b14bb83fc8ba73d30d3e0"`);
        await queryRunner.query(`ALTER TABLE "link" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "link" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_da35233ec2bfaa121bb3540039b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
