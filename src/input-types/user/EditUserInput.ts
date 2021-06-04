import { IsNotEmpty, IsEmail, IsOptional, IsInt } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class EditUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email?: string

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  adminRoleId?: number

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  planId?: number
}
