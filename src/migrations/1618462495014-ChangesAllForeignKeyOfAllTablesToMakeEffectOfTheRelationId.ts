import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangesAllForeignKeyOfAllTablesToMakeEffectOfTheRelationId1618462495014 implements MigrationInterface {
    name = 'ChangesAllForeignKeyOfAllTablesToMakeEffectOfTheRelationId1618462495014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "domain" DROP CONSTRAINT "FK_62091e8dd70081e0e8b24d1ac8b"`);
        await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_50c7c6ab3aec03b836c1216004c"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_fcb192cd2ea1e0e2a85780fe182"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_95eacbd8706a055ed95fc9daa86"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP CONSTRAINT "FK_2282915e7faca8e8ff6c76a5b9a"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_37974361030b59e73f601521bc8"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_4b664fed34ea1ec12bc20226da3"`);
        await queryRunner.query(`ALTER TABLE "link" DROP CONSTRAINT "FK_da35233ec2bfaa121bb3540039b"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_1cf56b10b23971cfd07e4fc6126"`);
        await queryRunner.query(`ALTER TABLE "user_logs" DROP CONSTRAINT "FK_6bea02878a5067f778dc5a62cb9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_aa22a94c276c9921fe6590c1557"`);
        await queryRunner.query(`ALTER TABLE "domain" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "code" RENAME COLUMN "plan_id" TO "planId"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "user_id" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "plan_id" TO "planId"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "link_id"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "project_id"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "biolink_id"`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD "linkId" uuid`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "link" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "link" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "link" ADD "biolinkId" uuid`);
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "biolinkId"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "link" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "linkId"`);
        await queryRunner.query(`ALTER TABLE "track_link" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "link" ADD "biolink_id" uuid`);
        await queryRunner.query(`ALTER TABLE "link" ADD "project_id" uuid`);
        await queryRunner.query(`ALTER TABLE "link" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD "project_id" uuid`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD "link_id" uuid`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "planId" TO "plan_id"`);
        await queryRunner.query(`ALTER TABLE "user_logs" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "code" RENAME COLUMN "planId" TO "plan_id"`);
        await queryRunner.query(`ALTER TABLE "domain" RENAME COLUMN "userId" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_aa22a94c276c9921fe6590c1557" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_logs" ADD CONSTRAINT "FK_6bea02878a5067f778dc5a62cb9" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_1cf56b10b23971cfd07e4fc6126" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_da35233ec2bfaa121bb3540039b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_4b664fed34ea1ec12bc20226da3" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "link" ADD CONSTRAINT "FK_37974361030b59e73f601521bc8" FOREIGN KEY ("biolink_id") REFERENCES "link"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_2282915e7faca8e8ff6c76a5b9a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_95eacbd8706a055ed95fc9daa86" FOREIGN KEY ("link_id") REFERENCES "link"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track_link" ADD CONSTRAINT "FK_fcb192cd2ea1e0e2a85780fe182" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "code" ADD CONSTRAINT "FK_50c7c6ab3aec03b836c1216004c" FOREIGN KEY ("plan_id") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "domain" ADD CONSTRAINT "FK_62091e8dd70081e0e8b24d1ac8b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
