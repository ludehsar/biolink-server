import { ObjectType, Field, Int } from 'type-graphql'

@ObjectType()
export class DashboardTotalCounts {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalBiolinks?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalShortenedLinks?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalBiolinkPageViewsTracked?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalLinkClickViewsTracked?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalUsers?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalReferralCodes?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalTransactionsMade?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  totalEarned?: number
}
