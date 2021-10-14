import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { Message } from '../entities'
import { ChatRoomToUser } from './ChatRoomToUser'

@ObjectType()
@Entity()
export class ChatRoom extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  roomName?: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  @Field(() => String, { nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date

  @Column({ type: 'timestamp', nullable: true })
  lastMessageSentDate?: Date

  // Relationships
  @OneToMany(() => Message, (message) => message.chatRoom, { lazy: true })
  messages!: Promise<Message[]>

  @Field(() => Message, { nullable: true })
  @OneToOne(() => Message, (message) => message.chatRoom, { lazy: true, nullable: true })
  @JoinColumn({ name: 'lastMessageSentId' })
  lastMessageSent!: Promise<Message>

  @RelationId((chatRoom: ChatRoom) => chatRoom.lastMessageSent)
  lastMessageSentId!: string

  @OneToMany(() => ChatRoomToUser, (relation) => relation.chatRoom, { lazy: true })
  chatRoomToUserRelations!: Promise<ChatRoomToUser[]>
}
