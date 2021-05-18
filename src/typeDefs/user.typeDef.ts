import { IsNotEmpty, IsEmail, MinLength } from 'class-validator'
import { InputType, Field, ObjectType } from 'type-graphql'

import { User } from '../models/entities/User'
import { FieldError } from './common.typeDef'

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

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@ObjectType()
export class ValidationResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => Boolean, { nullable: true })
  passesValidation!: boolean
}
