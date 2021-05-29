import { ErrorResponse, TrackingUnit } from '../../object-types'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class AnalyticsResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [TrackingUnit], { nullable: true })
  result?: TrackingUnit[]
}
