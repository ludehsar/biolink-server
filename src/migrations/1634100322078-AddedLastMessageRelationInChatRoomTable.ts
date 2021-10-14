import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedLastMessageRelationInChatRoomTable1634100322078 implements MigrationInterface {
    name = 'AddedLastMessageRelationInChatRoomTable1634100322078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."chat_room" ADD "lastMessageSentDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "public"."chat_room" ADD "lastMessageSentId" uuid`);
        await queryRunner.query(`ALTER TABLE "public"."chat_room" ADD CONSTRAINT "UQ_f4e2d3c75df8e871e3ccb63d9ed" UNIQUE ("lastMessageSentId")`);
        await queryRunner.query(`ALTER TABLE "public"."chat_room" ADD CONSTRAINT "FK_f4e2d3c75df8e871e3ccb63d9ed" FOREIGN KEY ("lastMessageSentId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."chat_room" DROP CONSTRAINT "FK_f4e2d3c75df8e871e3ccb63d9ed"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_room" DROP CONSTRAINT "UQ_f4e2d3c75df8e871e3ccb63d9ed"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_room" DROP COLUMN "lastMessageSentId"`);
        await queryRunner.query(`ALTER TABLE "public"."chat_room" DROP COLUMN "lastMessageSentDate"`);
    }

}
