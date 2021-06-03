import { IsNotEmpty, IsEmail, Matches, IsOptional, IsInt } from 'class-validator'
import { InputType, Field } from 'type-graphql'

@InputType()
export class NewUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email?: string

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  adminRoleId?: number

  @Field()
  @IsNotEmpty()
  @Matches('^[a-zA-Z0-9_.]{4,20}$')
  username?: string

  @Field({ nullable: true })
  @IsOptional()
  displayName?: string

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  categoryId?: number

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  planId?: number
}
