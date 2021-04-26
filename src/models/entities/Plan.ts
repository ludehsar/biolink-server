import { Field, Float, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { EnabledStatus } from '../enums/EnabledStatus'
import { PlanSettings } from '../jsonTypes/PlanSettings'
import { User } from './User'

@ObjectType()
@Entity()
export class Plan extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  name!: string

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', default: 0.0 })
  monthlyPrice!: number

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  monthlyPriceStripeId!: string

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', default: 0.0 })
  annualPrice!: number

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  annualPriceStripeId!: string

  @Field(() => PlanSettings, { nullable: true })
  @Column({ type: 'json', nullable: true })
  settings!: PlanSettings

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: EnabledStatus, default: EnabledStatus.Disabled })
  enabledStatus!: EnabledStatus

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  visibilityStatus!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  // Relationships
  @OneToMany(() => User, (user) => user.plan)
  users!: User[]
}
