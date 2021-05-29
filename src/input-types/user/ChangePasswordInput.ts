import { IsNotEmpty, MinLength } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  oldPassword!: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  newPassword!: string
}
