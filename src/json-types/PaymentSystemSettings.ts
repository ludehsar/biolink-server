import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class PaymentSystemSettings {
  @Field(() => String, { nullable: true })
  enablePaymentSystem!: string

  @Field(() => String, { nullable: true })
  enabledPaymentType!: string

  @Field(() => String, { nullable: true })
  brandName!: string

  @Field(() => String, { nullable: true })
  currency!: string

  @Field(() => String, { nullable: true })
  enableDiscountOrRedeemableCode!: string

  @Field(() => String, { nullable: true })
  enableTaxesAndBilling!: string

  @Field(() => String, { nullable: true })
  enablePaypal!: string

  @Field(() => String, { nullable: true })
  enableStripe!: string
}
