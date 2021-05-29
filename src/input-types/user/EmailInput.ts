import { IsNotEmpty, IsEmail } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class EmailInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email!: string
}
