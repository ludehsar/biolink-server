import { Field, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { TaxValueType, TaxType, TaxBillingForType } from '../enums'

@ObjectType()
@Entity()
export class Tax extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  internalName!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  name!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description!: string

  @Column({ default: 20 })
  @Field(() => Int, { nullable: true })
  value!: number

  @Column({ type: 'enum', enum: TaxValueType, default: TaxValueType.Fixed })
  @Field(() => String, { nullable: true })
  valueType!: TaxValueType

  @Column({ type: 'enum', enum: TaxType, default: TaxType.Inclusive })
  @Field(() => String, { nullable: true })
  type!: TaxType

  @Column({ type: 'enum', enum: TaxBillingForType, default: TaxBillingForType.Both })
  @Field(() => String, { nullable: true })
  billingFor!: TaxBillingForType

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  countries!: string

  @CreateDateColumn()
  @Field(() => String, { nullable: true })
  createdAt!: Date

  @UpdateDateColumn()
  @Field(() => String, { nullable: true })
  updatedAt!: Date

  @DeleteDateColumn()
  @Field(() => String, { nullable: true })
  deletedAt?: Date
}
