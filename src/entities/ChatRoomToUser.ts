import { Field, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'

import { User } from '.'
import { ChatRoom } from './ChatRoom'

@ObjectType()
@Entity()
export class ChatRoomToUser extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => Int, { nullable: true })
  @Column({ default: 0 })
  totalUnreadMessages!: number

  // Relationships
  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.chatRoomToUserRelations, {
    nullable: true,
    lazy: true,
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User>

  @RelationId((roomToUser: ChatRoomToUser) => roomToUser.user)
  userId!: string

  @Field(() => User, { nullable: false })
  @ManyToOne(() => ChatRoom, (room) => room.chatRoomToUserRelations, {
    nullable: true,
    lazy: true,
    cascade: true,
  })
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom!: Promise<ChatRoom>

  @RelationId((relation: ChatRoomToUser) => relation.chatRoom)
  chatRoomId!: string
}
