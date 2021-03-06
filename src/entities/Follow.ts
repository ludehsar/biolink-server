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
import { Biolink } from './Biolink'

import { User } from './User'

@ObjectType()
@Entity()
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.followers, { nullable: true, lazy: true, cascade: true })
  @JoinColumn({ name: 'followerId' })
  follower!: Promise<User> | User

  @RelationId((follow: Follow) => follow.follower)
  followerId!: string

  @Field(() => Biolink, { nullable: true })
  @ManyToOne(() => Biolink, (user) => user.followees, { nullable: true, lazy: true, cascade: true })
  @JoinColumn({ name: 'followeeId' })
  followee!: Promise<Biolink> | Biolink

  @RelationId((follow: Follow) => follow.followee)
  followeeId!: string
}
