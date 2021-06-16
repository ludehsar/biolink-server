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
} from 'typeorm'

import { User } from '../entities'
import { PaymentMethod } from '../enums'

@ObjectType()
@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.Stripe })
  paymentType!: PaymentMethod

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  stripeAmountDue!: number

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  stripeAmountPaid!: number

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  stripeAmountRemaining!: number

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeChargeId!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeInvoiceCreated!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripePaymentCurrency!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeCustomerId!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeCustomerAddress!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeCustomerEmail!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeCustomerName!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeCustomerPhone!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeCustomerShipping!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeDiscount!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeInvoicePdfUrl!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripePriceId!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeSubscriptionId!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeInvoiceNumber!: string

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  stripePeriodStart!: Date

  @Column({ type: 'date', nullable: true })
  @Field(() => String, { nullable: true })
  stripePeriodEnd!: Date

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripeStatus!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  // Relationships
  @ManyToOne(() => User, (user) => user.payments, { lazy: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User>

  @RelationId((payment: Payment) => payment.user)
  userId!: string
}
