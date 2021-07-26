import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'

import { User } from './User'

@ObjectType()
@Entity()
export class Follow extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.followers, { nullable: true, lazy: true })
  @JoinColumn({ name: 'followerId' })
  follower!: Promise<User>

  @RelationId((follow: Follow) => follow.follower)
  followerId!: string

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.followees, { nullable: true, lazy: true })
  @JoinColumn({ name: 'followeeId' })
  followee!: Promise<User>

  @RelationId((follow: Follow) => follow.followee)
  followeeId!: string
}