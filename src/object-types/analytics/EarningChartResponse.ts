import { EarningChartValue } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class EarningChartResponse {
  @Field(() => [EarningChartValue], { nullable: true })
  result?: EarningChartValue[]
}
