import { Field, Float, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PremiumUsernameType } from '../enums/PremiumUsernameType'

@ObjectType()
@Entity()
export class PremiumUsername extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  username!: string

  @Field(() => Float, { nullable: true })
  @Column()
  price!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: PremiumUsernameType, default: PremiumUsernameType.Premium })
  usernameType!: PremiumUsernameType

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  deletedAt!: Date
}
