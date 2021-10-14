import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '../entities'
import { ChatRoom } from './ChatRoom'

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  message?: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  attachmentUrl?: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  @Field(() => String, { nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date

  // Relationships
  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.sentMessages, {
    nullable: true,
    lazy: true,
    cascade: true,
  })
  @JoinColumn({ name: 'senderId' })
  sender!: Promise<User>

  @RelationId((message: Message) => message.sender)
  senderId!: string

  @Field(() => ChatRoom, { nullable: false })
  @ManyToOne(() => ChatRoom, (room) => room.messages, {
    nullable: true,
    lazy: true,
    cascade: true,
  })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom!: Promise<ChatRoom>

  @RelationId((message: Message) => message.chatRoom)
  chatRoomId!: string
}
