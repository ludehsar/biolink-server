import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
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
export class UserLogs extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  ipAddress!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  cityName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  countryCode!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  browserName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  browserLanguage!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  deviceType!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  osName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'userId' })
  user!: User

  @RelationId((userLogs: UserLogs) => userLogs.user)
  userId!: string
}
