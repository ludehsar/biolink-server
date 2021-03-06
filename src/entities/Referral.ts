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

import { User } from '../entities'

@ObjectType()
@Entity()
export class Referral extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  referredByEmail!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  referredByName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  referredToEmail!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  referredToName!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.referrals, { lazy: true, cascade: true })
  @JoinColumn({ name: 'referredById' })
  referredBy!: Promise<User> | User

  @RelationId((referral: Referral) => referral.referredBy)
  referredById!: string
}
