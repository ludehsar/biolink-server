import { IsNotEmpty, IsEmail, MinLength, Matches, IsOptional } from 'class-validator'
import { InputType, Field, ObjectType } from 'type-graphql'

import { User } from '../models/entities/User'
import { ErrorResponse } from './common.typeDef'

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
}

@InputType()
export class EmailInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email!: string
}

@InputType()
export class EmailAndUsernameInput {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string

  @Field({ nullable: true })
  @Matches('^[a-zA-Z0-9_.]{4,20}$')
  @IsOptional()
  username?: string
}

@InputType()
export class PasswordInput {
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password!: string
}

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

@ObjectType()
export class UserResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => User, { nullable: true })
  user?: User
}
