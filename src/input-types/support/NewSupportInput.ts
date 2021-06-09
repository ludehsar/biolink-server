import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class NewSupportInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  firstName?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  lastName?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsEmail()
  email?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string
}
