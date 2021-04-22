import { IsAlpha, IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql'

import { User } from '../models/entities/User'
import { MyContext } from '../MyContext'
import { loginUser, logoutUser, registerUser } from '../services/user.service'
import { BiolinkInput } from './biolink.resolver'
import { FieldError } from './commonTypes'
import CurrentUser from '../decorators/currentUser'

@InputType()
export class LoginInput {
  @Field()
  email!: string

  @Field()
  password!: string
}

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty()
  @IsAlpha()
  name!: string

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password!: string

  @Field()
  biolinkInput!: BiolinkInput
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@CurrentUser() user: User): User | null {
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: RegisterInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await registerUser(options, context)
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: LoginInput,
    @Ctx() context: MyContext
  ): Promise<UserResponse> {
    return await loginUser(options, context)
  }

  // @Mutation(() => Boolean)
  // async verifyEmail (): Promise<Boolean> {
  //   // TODO: implement email verification
  //   return true
  // }

  // @Mutation(() => Boolean)
  // async forgotPassword (): Promise<Boolean> {
  //   // TODO: implement forgot password
  //   return true
  // }

  // @Mutation(() => Boolean)
  // async changePassword (): Promise<Boolean> {
  //   // TODO: implement change password
  //   return true
  // }

  @Mutation(() => Boolean)
  async logout(@Ctx() context: MyContext, @CurrentUser() user: User): Promise<boolean> {
    return await logoutUser(context, user)
  }
}
