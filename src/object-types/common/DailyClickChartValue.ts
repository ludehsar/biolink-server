import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class DailyClickChartValue {
  @Field(() => Int, { defaultValue: 0 })
  views?: number

  @Field(() => String, { nullable: true })
  date?: Date
}
