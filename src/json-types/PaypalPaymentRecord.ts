import { Field, ObjectType } from 'type-graphql'

@ObjectType()
class Name {
  @Field(() => String, { nullable: true })
  given_name!: string
  @Field(() => String, { nullable: true })
  surname!: string
}

@ObjectType()
class Payer {
  @Field(() => Name, { nullable: true })
  name!: Name
  @Field(() => String, { nullable: true })
  email_address!: string
  @Field(() => String, { nullable: true })
  payer_id!: string
}

@ObjectType()
class Address {
  @Field(() => String, { nullable: true })
  address_line_1!: string
  @Field(() => String, { nullable: true })
  address_line_2!: string
  @Field(() => String, { nullable: true })
  admin_area_2!: string
  @Field(() => String, { nullable: true })
  admin_area_1!: string
  @Field(() => String, { nullable: true })
  postal_code!: string
  @Field(() => String, { nullable: true })
  country_code!: string
}

@ObjectType()
class Shipping {
  @Field(() => Address, { nullable: true })
  address!: Address
}

@ObjectType()
class Amount {
  @Field(() => String, { nullable: true })
  currency_code!: string
  @Field(() => String, { nullable: true })
  value!: string
}

@ObjectType()
class SellerProtection {
  @Field(() => String, { nullable: true })
  status!: string
  @Field(() => [String], { nullable: true })
  dispute_categories!: string[]
}

@ObjectType()
class GrossAmount {
  @Field(() => String, { nullable: true })
  currency_code!: string
  @Field(() => String, { nullable: true })
  value!: string
}

@ObjectType()
class PaypalFee {
  @Field(() => String, { nullable: true })
  currency_code!: string
  @Field(() => String, { nullable: true })
  value!: string
}

@ObjectType()
class NetAmount {
  @Field(() => String, { nullable: true })
  currency_code!: string
  @Field(() => String, { nullable: true })
  value!: string
}

@ObjectType()
class SellerReceivableBreakdown {
  @Field(() => GrossAmount, { nullable: true })
  gross_amount!: GrossAmount
  @Field(() => PaypalFee, { nullable: true })
  paypal_fee!: PaypalFee
  @Field(() => NetAmount, { nullable: true })
  net_amount!: NetAmount
}

@ObjectType()
class PaypalLink {
  @Field(() => String, { nullable: true })
  href!: string
  @Field(() => String, { nullable: true })
  rel!: string
  @Field(() => String, { nullable: true })
  method!: string
}

@ObjectType()
class Capture {
  @Field(() => String, { nullable: true })
  id!: string
  @Field(() => String, { nullable: true })
  status!: string
  @Field(() => Amount, { nullable: true })
  amount!: Amount
  @Field(() => SellerProtection, { nullable: true })
  seller_protection!: SellerProtection
  @Field(() => Boolean, { nullable: true })
  final_capture!: boolean
  @Field(() => String, { nullable: true })
  disbursement_mode!: string
  @Field(() => SellerReceivableBreakdown, { nullable: true })
  seller_receivable_breakdown!: SellerReceivableBreakdown
  @Field(() => Date, { nullable: true })
  create_time!: Date
  @Field(() => Date, { nullable: true })
  update_time!: Date
  @Field(() => [PaypalLink], { nullable: true })
  links!: PaypalLink[]
}

@ObjectType()
class Payments {
  @Field(() => [Capture], { nullable: true })
  captures!: Capture[]
}

@ObjectType()
class PurchaseUnit {
  @Field(() => String, { nullable: true })
  reference_id!: string
  @Field(() => Shipping, { nullable: true })
  shipping!: Shipping
  @Field(() => Payments, { nullable: true })
  payments!: Payments
}

@ObjectType()
export class PaypalPaymentRecord {
  @Field(() => String, { nullable: true })
  id!: string
  @Field(() => String, { nullable: true })
  status!: string
  @Field(() => Payer, { nullable: true })
  payer!: Payer
  @Field(() => [PurchaseUnit], { nullable: true })
  purchase_units!: PurchaseUnit[]
  @Field(() => [PaypalLink], { nullable: true })
  links!: PaypalLink[]
}
