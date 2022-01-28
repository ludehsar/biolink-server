import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  ValidateIf,
  IsPhoneNumber,
  IsEnum,
  IsBoolean,
} from 'class-validator'
import { InputType, Field } from 'type-graphql'

import { BillingType, PlanType } from '../../enums'

@InputType()
export class NewUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.adminRoleId !== '')
  adminRoleId?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.address1 !== '')
  address1?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.address2 !== '')
  address2?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.city !== '')
  city?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.country !== '')
  country?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.name !== '')
  name?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsPhoneNumber()
  @ValidateIf((e) => e.phone !== '')
  phone?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.state !== '')
  state?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(BillingType)
  @ValidateIf((e) => e.billingType !== '')
  billingType?: BillingType

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.zip !== '')
  zip?: string

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.planId !== '')
  planId?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.planExpirationDate !== '')
  planExpirationDate?: Date

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  planTrialDone?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(PlanType)
  @ValidateIf((e) => e.planType !== '')
  planType?: PlanType

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.registeredByCodeId !== '')
  registeredByCodeId?: string

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  usedReferralsToPurchasePlan?: boolean
}
