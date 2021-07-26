import { EarningChartValue, ErrorResponse } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class EarningChartResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [EarningChartValue], { nullable: true })
  result?: EarningChartValue[]
}
