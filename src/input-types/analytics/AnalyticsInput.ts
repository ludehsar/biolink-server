import { IsNotEmpty, IsDate } from 'class-validator'
import { InputType, Field } from 'type-graphql'

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
