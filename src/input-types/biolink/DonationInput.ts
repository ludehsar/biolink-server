import { InputType, Field } from 'type-graphql'
import { IsOptional, ValidateIf } from 'class-validator'

@InputType()
export class DonationInput {
  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.paypalLink !== '')
  paypalLink?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.venmoLink !== '')
  venmoLink?: string

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.payoneerLink !== '')
  payoneerLink?: string
}
