import { IsNotEmpty, IsDateString } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class AnalyticsInput {
  @Field()
  @IsNotEmpty()
  username!: string

  @Field(() => String, { nullable: true })
  @IsDateString()
  startDate?: Date

  @Field(() => String, { nullable: true })
  @IsDateString()
  endDate?: Date
}
