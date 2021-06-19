import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class NewSupportInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  fullName!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  company!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  subject!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  message!: string
}
