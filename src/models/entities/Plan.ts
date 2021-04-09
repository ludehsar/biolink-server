import { Field, Float, Int, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { EnabledStatus } from '../enums/EnabledStatus'
import { PlanSettings } from '../jsonTypes/PlanSettings'
import { User } from './User'

@ObjectType()
@Entity()
export class Plan extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  name!: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  monthlyPriceEnabled!: boolean;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', default: 0.0 })
  monthlyPrice!: number;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  annualPriceEnabled!: boolean;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', default: 0.0 })
  annualPrice!: number;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  lifetimePriceEnabled!: boolean;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', default: 0.0 })
  lifetimePrice!: number;

  @Field(() => PlanSettings, { nullable: true })
  @Column({ type: 'json', nullable: true })
  settings!: PlanSettings;

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: EnabledStatus, default: EnabledStatus.Disabled })
  enabledStatus!: EnabledStatus;

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @Field(() => User, { nullable: true })
  @OneToMany(() => User, user => user.plan)
  users!: User[];
}
