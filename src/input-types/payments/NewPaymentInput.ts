import { InputType, Field, Int } from 'type-graphql'
import { IsEnum, IsInt } from 'class-validator'

import { PaymentMethod } from '../../enums'

@InputType()
export class NewPaymentInput {
  @Field({ nullable: true })
  @IsEnum(PaymentMethod)
  paymentType?: PaymentMethod

  @Field(() => Int, { nullable: true })
  @IsInt()
  stripeAmountDue!: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  stripeAmountPaid!: number

  @Field(() => Int, { nullable: true })
  @IsInt()
  stripeAmountRemaining!: number

  @Field(() => String, { nullable: true })
  stripeChargeId!: string

  @Field(() => String, { nullable: true })
  stripeInvoiceCreated!: string

  @Field(() => String, { nullable: true })
  stripePaymentCurrency!: string

  @Field(() => String, { nullable: true })
  stripeCustomerId!: string

  @Field(() => String, { nullable: true })
  stripeCustomerAddress!: string

  @Field(() => String, { nullable: true })
  stripeCustomerEmail!: string

  @Field(() => String, { nullable: true })
  stripeCustomerName!: string

  @Field(() => String, { nullable: true })
  stripeCustomerPhone!: string

  @Field(() => String, { nullable: true })
  stripeCustomerShipping!: string

  @Field(() => String, { nullable: true })
  stripeDiscount!: string

  @Field(() => String, { nullable: true })
  stripeInvoicePdfUrl!: string

  @Field(() => String, { nullable: true })
  stripePriceId!: string

  @Field(() => String, { nullable: true })
  stripeSubscriptionId!: string

  @Field(() => String, { nullable: true })
  stripeInvoiceNumber!: string

  @Field(() => Int, { nullable: true })
  stripePeriodStart!: number

  @Field(() => Int, { nullable: true })
  stripePeriodEnd!: number

  @Field(() => String, { nullable: true })
  stripeStatus!: string
}
