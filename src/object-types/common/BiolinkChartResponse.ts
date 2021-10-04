import { BiolinkChartValue } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class BiolinkChartResponse {
  @Field(() => [BiolinkChartValue], { nullable: true })
  result?: BiolinkChartValue[]
}
