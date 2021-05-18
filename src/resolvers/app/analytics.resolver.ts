import { IsDate, IsNotEmpty } from 'class-validator'
import { Arg, Field, InputType, Mutation, ObjectType, Resolver } from 'type-graphql'

import CurrentUser from '../../decorators/currentUser'
import { User } from '../../models/entities/User'
import { FieldError } from './commonTypes'
import { getBiolinkTrackingsByBiolinkUsername } from '../../controllers/analytics.controller'

@InputType()
export class AnalyticsInput {
  @Field()
  @IsNotEmpty()
  username!: string

  @Field(() => String, { nullable: true })
  @IsDate()
  startDate?: Date

  @Field(() => String, { nullable: true })
  @IsDate()
  endDate?: Date
}

@ObjectType()
export class TrackingUnit {
  @Field()
  click_count!: number

  @Field(() => String)
  date!: Date
}

@ObjectType()
export class AnalyticsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => [TrackingUnit], { nullable: true })
  result?: TrackingUnit[]
}

@Resolver()
export class AnalyticsResolver {
  @Mutation(() => AnalyticsResponse)
  async getBiolinkAnalyticsByUsername(
    @Arg('options') options: AnalyticsInput,
    @CurrentUser() user: User
  ): Promise<AnalyticsResponse> {
    return await getBiolinkTrackingsByBiolinkUsername(
      options.username,
      user,
      options.startDate,
      options.endDate
    )
  }
}
