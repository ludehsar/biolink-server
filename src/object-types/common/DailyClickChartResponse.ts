import { ObjectType, Field } from 'type-graphql'
import { DailyClickChartValue } from './DailyClickChartValue'

@ObjectType()
export class DailyClickChartResponse {
  @Field(() => [DailyClickChartValue], { nullable: true })
  result?: DailyClickChartValue[]
}
