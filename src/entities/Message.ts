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

import { Room, User } from '../entities'

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
  @ManyToOne(() => User, (user) => user.messages, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'senderId' })
  sender!: Promise<User>

  @RelationId((message: Message) => message.sender)
  senderId!: string

  @ManyToOne(() => Room, (room) => room.messages, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'roomId' })
  room!: Promise<Room>

  @RelationId((message: Message) => message.room)
  roomId!: string
}
