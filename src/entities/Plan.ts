import { Field, Float, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PlanSettings } from '../json-types'
import { User } from '../entities'
import { EnabledStatus } from '../enums'
import { Payment } from './Payment'

@ObjectType()
@Entity()
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
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

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  @Field(() => String, { nullable: true })
  deletedAt?: Date

  // Relationships
  @OneToMany(() => User, (user) => user.plan, { lazy: true })
  users!: Promise<User[]> | User[]

  @OneToMany(() => Payment, (payment) => payment.plan, { nullable: true, lazy: true })
  payments!: Promise<Payment[]> | Payment[]
}
