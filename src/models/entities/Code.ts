import { Field, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { Plan } from './Plan'
import { CodeType } from '../enums/CodeType'

@ObjectType()
@Entity()
export class Code extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: CodeType, default: CodeType.Discount })
  type!: CodeType

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  code!: string

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, default: 0 })
  discount!: number

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true, default: 0 })
  quantity!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  expireDate!: Date

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  // Relationships
  @Field(() => Plan, { nullable: true })
  @ManyToOne(() => Plan, (plan) => plan.codes)
  @JoinColumn({ name: 'planId' })
  plan!: Plan

  @RelationId((code: Code) => code.plan)
  planId!: number
}
