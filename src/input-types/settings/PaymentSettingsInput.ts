import { IsBoolean, IsEnum, IsOptional, ValidateIf } from 'class-validator'
import { Field, InputType } from 'type-graphql'
import { PaymentType } from '../../enums'

@InputType()
export class PaymentSettingsInput {
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  enablePaymentSystem!: boolean

  @Field(() => String, { nullable: true, defaultValue: PaymentType.Both })
  @IsEnum(PaymentType)
  @IsOptional()
  @ValidateIf((e) => e.enabledPaymentType !== '')
  enabledPaymentType!: PaymentType

  @Field(() => String, { nullable: true })
  brandName!: string

  @Field(() => String, { nullable: true })
  currency!: string

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  enableDiscountOrRedeemableCode!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  enableTaxesAndBilling!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  enablePaypal!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  enableStripe!: boolean
}
