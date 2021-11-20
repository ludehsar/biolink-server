export class AutomaticTax {
  enabled?: boolean
  status?: string
}

export class Period {
  end?: number
  start?: number
}

export class Plan {
  id?: string
  object?: string
  active?: boolean
  aggregate_usage?: string
  amount?: number
  amount_decimal?: string
  billing_scheme?: string
  created?: number
  currency?: string
  interval?: string
  interval_count?: number
  livemode?: boolean
  nickname?: string
  product?: string
  tiers_mode?: string
  transform_usage?: string
  trial_period_days?: string
  usage_type?: string
}

export class Recurring {
  aggregate_usage?: string
  interval?: string
  interval_count?: number
  trial_period_days?: string
  usage_type?: string
}

export class Price {
  id?: string
  object?: string
  active?: boolean
  billing_scheme?: string
  created?: number
  currency?: string
  livemode?: boolean
  lookup_key?: string
  nickname?: string
  product?: string
  recurring?: Recurring
  tax_behavior?: string
  tiers_mode?: string
  transform_quantity?: string
  type?: string
  unit_amount?: number
  unit_amount_decimal?: string
}

export class Datum {
  id?: string
  object?: string
  amount?: number
  currency?: string
  description?: string
  discount_amounts?: string[]
  discountable?: boolean
  discounts?: string[]
  livemode?: boolean
  period?: Period
  plan?: Plan
  price?: Price
  proration?: boolean
  quantity?: number
  subscription?: string
  subscription_item?: string
  tax_amounts?: string[]
  tax_rates?: string[]
  type?: string
}

export class Lines {
  object?: string
  data?: Datum[]
  has_more?: boolean
  total_count?: number
  url?: string
}

export class PaymentSettings {
  payment_method_options?: string
  payment_method_types?: string
}

export class StatusTransitions {
  finalized_at?: number
  marked_uncollectible_at?: string
  paid_at?: number
  voided_at?: string
}

export class PaymentEvent {
  id?: string
  object?: string
  account_country?: string
  account_name?: string
  account_tax_ids?: string
  amount_due?: number
  amount_paid?: number
  amount_remaining?: number
  application_fee_amount?: string
  attempt_count?: number
  attempted?: boolean
  auto_advance?: boolean
  automatic_tax?: AutomaticTax
  billing_reason?: string
  charge?: string
  collection_method?: string
  created?: number
  currency?: string
  custom_fields?: string
  customer?: string
  customer_address?: string
  customer_email?: string
  customer_name?: string
  customer_phone?: string
  customer_shipping?: string
  customer_tax_exempt?: string
  customer_tax_ids?: string[]
  default_payment_method?: string
  default_source?: string
  default_tax_rates?: string[]
  description?: string
  discount?: string
  discounts?: string[]
  due_date?: string
  ending_balance?: number
  footer?: string
  hosted_invoice_url?: string
  invoice_pdf?: string
  last_finalization_error?: string
  lines?: Lines
  livemode?: boolean
  next_payment_attempt?: string
  number?: string
  on_behalf_of?: string
  paid?: boolean
  payment_intent?: string
  payment_settings?: PaymentSettings
  period_end?: number
  period_start?: number
  post_payment_credit_notes_amount?: number
  pre_payment_credit_notes_amount?: number
  quote?: string
  receipt_number?: string
  starting_balance?: number
  statement_descriptor?: string
  status?: string
  status_transitions?: StatusTransitions
  subscription?: string
  subtotal?: number
  tax?: string
  total?: number
  total_discount_amounts?: string[]
  total_tax_amounts?: string[]
  transfer_data?: string
  webhooks_delivered_at?: number
}

export class Data {
  object?: PaymentEvent
}

export class Request {
  id?: string
  idempotency_key?: string
}

export class StripePaymentRecord {
  id?: string
  object?: string
  api_version?: string
  created?: number
  data?: Data
  livemode?: boolean
  pending_webhooks?: number
  request?: Request
  type?: string
}
