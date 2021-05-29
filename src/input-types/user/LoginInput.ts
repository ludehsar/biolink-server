import { IsNotEmpty, IsEmail } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class LoginInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @Field()
  @IsNotEmpty()
  password!: string
}
