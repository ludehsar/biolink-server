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

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.receivedMessages, {
    nullable: true,
    lazy: true,
    cascade: true,
  })
  @JoinColumn({ name: 'receiverId' })
  receiver!: Promise<User>

  @RelationId((message: Message) => message.receiver)
  receiverId!: string
}
