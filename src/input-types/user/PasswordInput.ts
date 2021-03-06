import { IsNotEmpty, MinLength } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class PasswordInput {
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password!: string
}
