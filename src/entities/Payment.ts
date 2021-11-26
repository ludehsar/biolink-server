import { Field, Float, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'

import { PaymentRecordUnion, PaypalPaymentRecord, StripeInvoiceObject } from '../json-types'
import { Order, Plan, User } from '../entities'
import { PaymentCurrency, PaymentProvider, PaymentType } from '../enums'

@ObjectType()
@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id!: string

  @Column({ unique: true })
  representedId!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.Checkout })
  paymentType!: PaymentType

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: PaymentProvider, default: PaymentProvider.Stripe })
  paymentProvider!: PaymentProvider

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', default: 0.0 })
  amountPaid!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: PaymentCurrency, default: PaymentCurrency.USD })
  paymentCurrency!: PaymentCurrency

  @Field(() => PaymentRecordUnion, { nullable: true })
  @Column({ type: 'json', nullable: true })
  paymentDetails!: StripeInvoiceObject | PaypalPaymentRecord

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.payments, { lazy: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User>

  @RelationId((payment: Payment) => payment.user)
  userId!: string

  @Field(() => Order, { nullable: true })
  @OneToOne(() => Order, (order) => order.payment, { nullable: true, lazy: true })
  @JoinColumn({ name: 'orderId' })
  order?: Promise<Order>

  @RelationId((payment: Payment) => payment.order)
  orderId?: string

  @Field(() => Plan, { nullable: true })
  @ManyToOne(() => Plan, (plan) => plan.payments, { nullable: true, lazy: true })
  @JoinColumn({ name: 'planId' })
  plan?: Promise<Plan>

  @RelationId((payment: Payment) => payment.plan)
  planId?: string
}
