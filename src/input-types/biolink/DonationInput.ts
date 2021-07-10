import { InputType, Field } from 'type-graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class DonationInput {
  @Field({ nullable: true })
  @IsOptional()
  paypalLink?: string

  @Field({ nullable: true })
  @IsOptional()
  venmoLink?: string

  @Field({ nullable: true })
  @IsOptional()
  payoneerLink?: string
}
