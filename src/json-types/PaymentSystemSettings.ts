import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class PaymentSystemSettings {
  @Field(() => Boolean, { nullable: true })
  enablePaymentSystem!: boolean

  @Field(() => Boolean, { nullable: true })
  enabledPaymentType!: boolean

  @Field(() => String, { nullable: true })
  brandName!: string

  @Field(() => String, { nullable: true })
  currency!: string

  @Field(() => Boolean, { nullable: true })
  enableDiscountOrRedeemableCode!: boolean

  @Field(() => Boolean, { nullable: true })
  enableTaxesAndBilling!: boolean

  @Field(() => Boolean, { nullable: true })
  enablePaypal!: boolean

  @Field(() => Boolean, { nullable: true })
  enableStripe!: boolean
}
