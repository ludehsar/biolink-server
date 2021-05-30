import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator'
import { Field, InputType } from 'type-graphql'

import { BillingType } from '../../enums'

@InputType()
export class BillingInput {
  @Field(() => String, { defaultValue: BillingType.Personal })
  @IsNotEmpty()
  type?: BillingType

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  name?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  address1?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  address2?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  city?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  state?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  country?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  zip?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone?: string
}
