import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class NewReportInput {
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
  @IsNotEmpty()
  @IsUrl()
  reportedUrl?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  description?: string
}
