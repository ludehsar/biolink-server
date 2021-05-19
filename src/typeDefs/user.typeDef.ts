import { IsNotEmpty, IsEmail, MinLength } from 'class-validator'
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
  name?: string

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

@ObjectType()
export class ValidationResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => Boolean, { nullable: true })
  passesValidation!: boolean
}
