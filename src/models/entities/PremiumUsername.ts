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

import { PremiumUsernameType } from '../enums/PremiumUsernameType'
import { User } from './User'

@ObjectType()
@Entity()
export class PremiumUsername extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id!: string

  @Column({ unique: true })
  @Field(() => String, { nullable: true })
  username!: string

  @Column()
  @Field(() => String, { nullable: true })
  price!: number

  @Column({ type: 'enum', enum: PremiumUsernameType, default: PremiumUsernameType.Premium })
  @Field(() => String, { nullable: true })
  usernameType!: PremiumUsernameType

  @CreateDateColumn()
  @Field(() => String, { nullable: true })
  createdAt!: Date

  @UpdateDateColumn()
  @Field(() => String, { nullable: true })
  updatedAt!: Date

  @DeleteDateColumn()
  @Field(() => String, { nullable: true })
  deletedAt?: Date

  // Relationships
  @Field(() => String, { nullable: true })
  @ManyToOne(() => User, (user) => user.premiumUsernames, { nullable: true, lazy: true })
  @JoinColumn({ name: 'ownerId' })
  owner!: Promise<User>

  @RelationId((premiumUsername: PremiumUsername) => premiumUsername.owner)
  ownerId!: string
}
