import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedChatRoomsTableForGroupMessaging1633893054427 implements MigrationInterface {
    name = 'AddedChatRoomsTableForGroupMessaging1633893054427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."message" DROP CONSTRAINT "FK_71fb36906595c602056d936fc13"`);
        await queryRunner.query(`ALTER TABLE "public"."message" RENAME COLUMN "receiverId" TO "chatRoomId"`);
        await queryRunner.query(`CREATE TABLE "chat_room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roomName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8aa3a52cf74c96469f0ef9fbe3e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_room_to_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalUnreadMessages" integer NOT NULL DEFAULT '0', "userId" uuid, "chatRoomId" uuid, CONSTRAINT "PK_6f27e86fa885f79a58dbcbacb50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chat_room_to_user" ADD CONSTRAINT "FK_18de3e42ff2757efe4f60b6d0b4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_room_to_user" ADD CONSTRAINT "FK_cb9fad30c77558562dc94bb1689" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."message" ADD CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21" FOREIGN KEY ("chatRoomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."message" DROP CONSTRAINT "FK_f3cc0ca0c4b191410f1e0ab5d21"`);
        await queryRunner.query(`ALTER TABLE "chat_room_to_user" DROP CONSTRAINT "FK_cb9fad30c77558562dc94bb1689"`);
        await queryRunner.query(`ALTER TABLE "chat_room_to_user" DROP CONSTRAINT "FK_18de3e42ff2757efe4f60b6d0b4"`);
        await queryRunner.query(`DROP TABLE "chat_room_to_user"`);
        await queryRunner.query(`DROP TABLE "chat_room"`);
        await queryRunner.query(`ALTER TABLE "public"."message" RENAME COLUMN "chatRoomId" TO "receiverId"`);
        await queryRunner.query(`ALTER TABLE "public"."message" ADD CONSTRAINT "FK_71fb36906595c602056d936fc13" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
