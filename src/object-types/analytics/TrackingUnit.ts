import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class TrackingUnit {
  @Field()
  click_count!: number

  @Field(() => String)
  date!: Date
}
