import { Field, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { TaxValueType } from '../enums/TaxValueType'
import { Plan } from './Plan'
import { TaxBillingForType } from '../enums/TaxBillingForType'
import { TaxType } from '../enums/TaxType'

@ObjectType()
@Entity()
export class Tax extends BaseEntity {
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String, { nullable: true })
  @Column()
  internalName!: string

  @Field(() => String, { nullable: true })
  @Column()
  name!: string

  @Field(() => String, { nullable: true })
  @Column()
  description!: string

  @Field(() => Int, { nullable: true })
  @Column({ default: 20 })
  value!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: TaxValueType, default: TaxValueType.Discount })
  valueType!: TaxValueType

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: TaxType, default: TaxType.Inclusive })
  type!: TaxType

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: TaxBillingForType, default: TaxBillingForType.Both })
  billingFor!: TaxBillingForType

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  countries!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  // Relationships
  @Field(() => Plan, { nullable: true })
  @ManyToMany(() => Plan, (plan) => plan.taxes)
  @JoinTable()
  plans!: Plan[]
}
