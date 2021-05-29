import { IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email?: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password?: string

  @Field()
  @IsNotEmpty()
  @Matches('^[a-zA-Z0-9_.]{4,20}$')
  username?: string
}
