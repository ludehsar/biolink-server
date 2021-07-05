import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { InputType, Field, Float } from 'type-graphql'
import { TaxBillingForType, TaxType, TaxValueType } from '../../enums'

@InputType()
export class NewTaxInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  internalName?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  name?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string

  @Field(() => Float, { nullable: true })
  @IsNotEmpty()
  @IsNumber()
  value?: number

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsEnum(TaxValueType)
  valueType?: TaxValueType

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsEnum(TaxType)
  type?: TaxType

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsEnum(TaxBillingForType)
  billingFor?: TaxBillingForType

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  countries?: string
}
