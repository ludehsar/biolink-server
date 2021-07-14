import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User, Message } from '../entities'

@ObjectType()
@Entity()
export class Room extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  roomTitle!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastMessageId!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  // Relationships
  @ManyToMany(() => User, (user) => user.rooms, { lazy: true })
  @JoinTable()
  users!: Promise<User[]>

  @OneToMany(() => Message, (message) => message.room, { lazy: true, cascade: true })
  messages!: Promise<Message[]>
}
