import { ErrorResponse } from '../../object-types'
import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
class UserTotalCounts {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalBiolinks?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalShortenedLinks?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalReferralCodes?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalPayed?: number
}

@ObjectType()
export class UserTotalCountsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => UserTotalCounts, { nullable: true })
  result?: UserTotalCounts
}
