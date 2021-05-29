import { Referral } from 'entities'
import { ErrorResponse } from 'object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class ReferralResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [Referral], { nullable: true })
  referrals?: Referral[]
}
