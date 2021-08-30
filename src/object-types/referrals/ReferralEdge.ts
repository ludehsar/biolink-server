import { Referral } from '../../entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ReferralEdge {
  @Field(() => Referral)
  node!: Referral

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
