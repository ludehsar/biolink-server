import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class EarningChartValue {
  @Field(() => Int, { defaultValue: 0 })
  earned?: number

  @Field(() => String, { nullable: true })
  date?: Date
}
