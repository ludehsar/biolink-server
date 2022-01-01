import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class UserTotalCountsResponse {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalBiolinks?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalShortenedLinks?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalReferralCodes?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalPayed?: number
}
