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
export class Referral extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
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
  @ManyToOne(() => User, (user) => user.referrals)
  @JoinColumn({ name: 'referredById' })
  referredBy!: User

  @RelationId((referral: Referral) => referral.referredBy)
  referredById!: string
}
