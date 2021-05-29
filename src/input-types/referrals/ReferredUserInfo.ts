import { IsNotEmpty, IsEmail } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class ReferredUserInfo {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  referredToEmail!: string

  @Field()
  @IsNotEmpty()
  referredToName!: string
}
