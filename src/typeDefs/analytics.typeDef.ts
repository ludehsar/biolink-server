import { IsNotEmpty, IsDate } from 'class-validator'
import { InputType, Field, ObjectType } from 'type-graphql'

import { ErrorResponse } from './common.typeDef'

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
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [TrackingUnit], { nullable: true })
  result?: TrackingUnit[]
}
