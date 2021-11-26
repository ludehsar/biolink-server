import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
class AutomaticTax {
  @Field(() => Boolean, { nullable: true })
  enabled!: boolean
  @Field(() => String, { nullable: true })
  status!: string
}

@ObjectType()
class Period {
  @Field(() => Int, { nullable: true })
  end!: number
  @Field(() => Int, { nullable: true })
  start!: number
}

@ObjectType()
class StripePlan {
  @Field(() => String, { nullable: true })
  id!: string
  @Field(() => String, { nullable: true })
  object!: string
  @Field(() => Boolean, { nullable: true })
  active!: boolean
  @Field(() => String, { nullable: true })
  aggregate_usage!: string
  @Field(() => Int, { nullable: true })
  amount!: number
  @Field(() => String, { nullable: true })
  amount_decimal!: string
  @Field(() => String, { nullable: true })
  billing_scheme!: string
  @Field(() => Int, { nullable: true })
  created!: number
  @Field(() => String, { nullable: true })
  currency!: string
  @Field(() => String, { nullable: true })
  interval!: string
  @Field(() => Int, { nullable: true })
  interval_count!: number
  @Field(() => Boolean, { nullable: true })
  livemode!: boolean
  @Field(() => String, { nullable: true })
  nickname!: string
  @Field(() => String, { nullable: true })
  product!: string
  @Field(() => String, { nullable: true })
  tiers_mode!: string
  @Field(() => String, { nullable: true })
  transform_usage!: string
  @Field(() => String, { nullable: true })
  trial_period_days!: string
  @Field(() => String, { nullable: true })
  usage_type!: string
}

@ObjectType()
class Recurring {
  @Field(() => String, { nullable: true })
  aggregate_usage!: string
  @Field(() => String, { nullable: true })
  interval!: string
  @Field(() => Int, { nullable: true })
  interval_count!: number
  @Field(() => String, { nullable: true })
  trial_period_days!: string
  @Field(() => String, { nullable: true })
  usage_type!: string
}

@ObjectType()
class Price {
  @Field(() => String, { nullable: true })
  id!: string
  @Field(() => String, { nullable: true })
  object!: string
  @Field(() => Boolean, { nullable: true })
  active!: boolean
  @Field(() => String, { nullable: true })
  billing_scheme!: string
  @Field(() => Int, { nullable: true })
  created!: number
  @Field(() => String, { nullable: true })
  currency!: string
  @Field(() => Boolean, { nullable: true })
  livemode!: boolean
  @Field(() => String, { nullable: true })
  lookup_key!: string
  @Field(() => String, { nullable: true })
  nickname!: string
  @Field(() => String, { nullable: true })
  product!: string
  @Field(() => Recurring, { nullable: true })
  recurring!: Recurring
  @Field(() => String, { nullable: true })
  tax_behavior!: string
  @Field(() => String, { nullable: true })
  tiers_mode!: string
  @Field(() => String, { nullable: true })
  transform_quantity!: string
  @Field(() => String, { nullable: true })
  type!: string
  @Field(() => Int, { nullable: true })
  unit_amount!: number
  @Field(() => String, { nullable: true })
  unit_amount_decimal!: string
}

@ObjectType()
class Data {
  @Field(() => String, { nullable: true })
  id!: string
  @Field(() => String, { nullable: true })
  object!: string
  @Field(() => Int, { nullable: true })
  amount!: number
  @Field(() => String, { nullable: true })
  currency!: string
  @Field(() => String, { nullable: true })
  description!: string
  @Field(() => [String], { nullable: true })
  discount_amounts!: string[]
  @Field(() => Boolean, { nullable: true })
  discountable!: boolean
  @Field(() => [String], { nullable: true })
  discounts!: string[]
  @Field(() => Boolean, { nullable: true })
  livemode!: boolean
  @Field(() => Period, { nullable: true })
  period!: Period
  @Field(() => StripePlan, { nullable: true })
  plan!: StripePlan
  @Field(() => Price, { nullable: true })
  price!: Price
  @Field(() => Boolean, { nullable: true })
  proration!: boolean
  @Field(() => Int, { nullable: true })
  quantity!: number
  @Field(() => String, { nullable: true })
  subscription!: string
  @Field(() => String, { nullable: true })
  subscription_item!: string
  @Field(() => [String], { nullable: true })
  tax_amounts!: string[]
  @Field(() => [String], { nullable: true })
  tax_rates!: string[]
  @Field(() => String, { nullable: true })
  type!: string
}

@ObjectType()
class Lines {
  @Field(() => String, { nullable: true })
  object!: string
  @Field(() => [Data], { nullable: true })
  data!: Data[]
  @Field(() => Boolean, { nullable: true })
  has_more!: boolean
  @Field(() => Int, { nullable: true })
  total_count!: number
  @Field(() => String, { nullable: true })
  url!: string
}

@ObjectType()
class PaymentSettings {
  @Field(() => String, { nullable: true })
  payment_method_options!: string
  @Field(() => String, { nullable: true })
  payment_method_types!: string
}

@ObjectType()
class StatusTransitions {
  @Field(() => Int, { nullable: true })
  finalized_at!: number
  @Field(() => String, { nullable: true })
  marked_uncollectible_at!: string
  @Field(() => Int, { nullable: true })
  paid_at!: number
  @Field(() => String, { nullable: true })
  voided_at!: string
}

@ObjectType()
export class StripeInvoiceObject {
  @Field(() => String, { nullable: true })
  id!: string
  @Field(() => String, { nullable: true })
  object!: string
  @Field(() => String, { nullable: true })
  account_country!: string
  @Field(() => String, { nullable: true })
  account_name!: string
  @Field(() => String, { nullable: true })
  account_tax_ids!: string
  @Field(() => Int, { nullable: true })
  amount_due!: number
  @Field(() => Int, { nullable: true })
  amount_paid!: number
  @Field(() => Int, { nullable: true })
  amount_remaining!: number
  @Field(() => String, { nullable: true })
  application_fee_amount!: string
  @Field(() => Int, { nullable: true })
  attempt_count!: number
  @Field(() => Boolean, { nullable: true })
  attempted!: boolean
  @Field(() => Boolean, { nullable: true })
  auto_advance!: boolean
  @Field(() => AutomaticTax, { nullable: true })
  automatic_tax!: AutomaticTax
  @Field(() => String, { nullable: true })
  billing_reason!: string
  @Field(() => String, { nullable: true })
  charge!: string
  @Field(() => String, { nullable: true })
  collection_method!: string
  @Field(() => Int, { nullable: true })
  created!: number
  @Field(() => String, { nullable: true })
  currency!: string
  @Field(() => String, { nullable: true })
  custom_fields!: string
  @Field(() => String, { nullable: true })
  customer!: string
  @Field(() => String, { nullable: true })
  customer_address!: string
  @Field(() => String, { nullable: true })
  customer_email!: string
  @Field(() => String, { nullable: true })
  customer_name!: string
  @Field(() => String, { nullable: true })
  customer_phone!: string
  @Field(() => String, { nullable: true })
  customer_shipping!: string
  @Field(() => String, { nullable: true })
  customer_tax_exempt!: string
  @Field(() => [String], { nullable: true })
  customer_tax_ids!: string[]
  @Field(() => String, { nullable: true })
  default_payment_method!: string
  @Field(() => String, { nullable: true })
  default_source!: string
  @Field(() => [String], { nullable: true })
  default_tax_rates!: string[]
  @Field(() => String, { nullable: true })
  description!: string
  @Field(() => String, { nullable: true })
  discount!: string
  @Field(() => [String], { nullable: true })
  discounts!: string[]
  @Field(() => String, { nullable: true })
  due_date!: string
  @Field(() => Int, { nullable: true })
  ending_balance!: number
  @Field(() => String, { nullable: true })
  footer!: string
  @Field(() => String, { nullable: true })
  hosted_invoice_url!: string
  @Field(() => String, { nullable: true })
  invoice_pdf!: string
  @Field(() => String, { nullable: true })
  last_finalization_error!: string
  @Field(() => Lines, { nullable: true })
  lines!: Lines
  @Field(() => Boolean, { nullable: true })
  livemode!: boolean
  @Field(() => String, { nullable: true })
  next_payment_attempt!: string
  @Field(() => String, { nullable: true })
  number!: string
  @Field(() => String, { nullable: true })
  on_behalf_of!: string
  @Field(() => Boolean, { nullable: true })
  paid!: boolean
  @Field(() => String, { nullable: true })
  payment_intent!: string
  @Field(() => PaymentSettings, { nullable: true })
  payment_settings!: PaymentSettings
  @Field(() => Int, { nullable: true })
  period_end!: number
  @Field(() => Int, { nullable: true })
  period_start!: number
  @Field(() => Int, { nullable: true })
  post_payment_credit_notes_amount!: number
  @Field(() => Int, { nullable: true })
  pre_payment_credit_notes_amount!: number
  @Field(() => String, { nullable: true })
  quote!: string
  @Field(() => String, { nullable: true })
  receipt_number!: string
  @Field(() => Int, { nullable: true })
  starting_balance!: number
  @Field(() => String, { nullable: true })
  statement_descriptor!: string
  @Field(() => String, { nullable: true })
  status!: string
  @Field(() => StatusTransitions, { nullable: true })
  status_transitions!: StatusTransitions
  @Field(() => String, { nullable: true })
  subscription!: string
  @Field(() => Int, { nullable: true })
  subtotal!: number
  @Field(() => String, { nullable: true })
  tax!: string
  @Field(() => Int, { nullable: true })
  total!: number
  @Field(() => [String], { nullable: true })
  total_discount_amounts!: string[]
  @Field(() => [String], { nullable: true })
  total_tax_amounts!: string[]
  @Field(() => String, { nullable: true })
  transfer_data!: string
  @Field(() => Int, { nullable: true })
  webhooks_delivered_at!: number
}
