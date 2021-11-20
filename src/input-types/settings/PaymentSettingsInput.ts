import { IsBoolean, IsEnum, IsOptional, ValidateIf } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { AcceptingPaymentType } from '../../enums'

@InputType()
export class PaymentSettingsInput {
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enablePaymentSystem!: boolean

  @Field(() => String, { nullable: true, defaultValue: AcceptingPaymentType.Both })
  @IsEnum(AcceptingPaymentType)
  @IsOptional()
  @ValidateIf((e) => e.enabledAcceptingPaymentType !== '')
  enabledAcceptingPaymentType!: AcceptingPaymentType

  @Field(() => String, { nullable: true })
  brandName!: string

  @Field(() => String, { nullable: true })
  currency!: string

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableDiscountOrRedeemableCode!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableTaxesAndBilling!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enablePaypal!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableStripe!: boolean
}
