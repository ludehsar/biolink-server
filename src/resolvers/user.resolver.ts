import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

import { User } from '../models/entities/User'
import { MyContext } from '../MyContext'
import {
  loginUser,
  logoutUser,
  registerUser,
  sendEmailForVerification,
  sendForgotPasswordVerificationEmail,
  validateUserRegistration,
  verifyEmailByActivationCode,
  verifyForgotPassword,
} from '../services/user.service'
import { BooleanResponse, FieldError } from './commonTypes'
import CurrentUser from '../decorators/currentUser'
import { NewBiolinkInput } from './biolink.resolver'

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

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@CurrentUser() user: User): User | null {
    return user
  }

  @Query(() => ValidationResponse, { nullable: true })
  async userRegistrationValidationCheck(
    @Arg('userOptions') userOptions: RegisterInput,
    @Arg('biolinkOptions') biolinkOptions: NewBiolinkInput
  ): Promise<ValidationResponse> {
    return await validateUserRegistration(userOptions, biolinkOptions)
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg('options') options: RegisterInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await registerUser(options, context)
  }

  @Mutation(() => Boolean)
  async sendEmailVerification(@CurrentUser() user: User): Promise<BooleanResponse> {
    return await sendEmailForVerification(user)
  }

  @Mutation(() => Boolean)
  async verifyUserEmail(
    @Arg('emailActivationCode') emailActivationCode: string
  ): Promise<BooleanResponse> {
    return await verifyEmailByActivationCode(emailActivationCode)
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await loginUser(options, context)
  }

  @Mutation(() => Boolean)
  async sendForgotPasswordEmail(@Arg('email') email: string): Promise<BooleanResponse> {
    return await sendForgotPasswordVerificationEmail(email)
  }

  @Mutation(() => Boolean)
  async verifyForgotPassword(
    @Arg('options') options: LoginInput,
    @Arg('forgotPasswordCode') forgotPasswordCode: string
  ): Promise<BooleanResponse> {
    return await verifyForgotPassword(options.email, options.password, forgotPasswordCode)
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() context: MyContext, @CurrentUser() user: User): Promise<BooleanResponse> {
    return await logoutUser(context, user)
  }
}
