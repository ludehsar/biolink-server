import { IsBoolean, IsEmail, IsOptional, IsPhoneNumber, ValidateIf } from 'class-validator'
import { Field, InputType } from 'type-graphql'

@InputType()
export class BusinessSettingsInput {
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  enableInvoice!: boolean

  @Field(() => String, { nullable: true })
  name!: string

  @Field(() => String, { nullable: true })
  address!: string

  @Field(() => String, { nullable: true })
  city!: string

  @Field(() => String, { nullable: true })
  country!: string

  @Field(() => String, { nullable: true })
  zipCode!: string

  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  @ValidateIf((e) => e.email !== '')
  email!: string

  @Field(() => String, { nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  @ValidateIf((e) => e.phone !== '')
  phone!: string

  @Field(() => String, { nullable: true })
  taxType!: string

  @Field(() => String, { nullable: true })
  taxId!: string
}
