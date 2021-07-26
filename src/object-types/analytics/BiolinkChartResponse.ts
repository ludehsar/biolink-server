import { BiolinkChartValue, ErrorResponse } from '..'
import { ObjectType, Field } from 'type-graphql'

@ObjectType()
export class BiolinkChartResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [BiolinkChartValue], { nullable: true })
  result?: BiolinkChartValue[]
}
