import { IsNotEmpty, IsNumber } from 'class-validator'
import { InputType, Field, Float } from 'type-graphql'

@InputType()
export class NewServiceInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  title?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  description?: string

  @Field(() => Float, { nullable: true, defaultValue: 0.0 })
  @IsNumber()
  @IsNotEmpty()
  price?: number
}
