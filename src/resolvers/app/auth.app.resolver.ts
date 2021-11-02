import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { authUser } from '../../middlewares'
import { User } from '../../entities'
import { RegisterInput, LoginInput, EmailInput, PasswordInput } from '../../input-types'
import { UserWithTokens } from '../../object-types'
import { MyContext } from '../../types'
import { AuthController } from '../../controllers'
import { AccessAndRefreshToken } from '../../object-types/auth/AccessAndRefreshToken'

@Resolver(User)
export class AuthResolver {
  constructor(private readonly authController: AuthController) {}

  @Query(() => User, { nullable: true })
  @UseMiddleware(authUser)
  me(@Ctx() context: MyContext): User | null {
    if (context.user) return context.user
    return null
  }

  @Mutation(() => UserWithTokens)
  async registerUser(
    @Arg('options', { description: 'Register inputs' }) options: RegisterInput,
    @Ctx() context: MyContext
  ): Promise<UserWithTokens> {
    return await this.authController.register(options, context)
  }

  @Mutation(() => UserWithTokens)
  async login(
    @Arg('options', { description: 'Login inputs' }) options: LoginInput,
    @Ctx() context: MyContext
  ): Promise<UserWithTokens> {
    return await this.authController.login(options, context)
  }

  @Mutation(() => Boolean, { nullable: true })
  async logout(@Ctx() context: MyContext): Promise<void> {
    return await this.authController.logout(context)
  }

  @Mutation(() => AccessAndRefreshToken)
  async refreshToken(@Ctx() context: MyContext): Promise<AccessAndRefreshToken> {
    return await this.authController.refreshToken(context)
  }

  @Mutation(() => Boolean, { nullable: true })
  async sendForgotPasswordEmail(@Arg('options') options: EmailInput): Promise<void> {
    return await this.authController.forgotPassword(options.email)
  }

  @Mutation(() => Boolean, { nullable: true })
  async verifyForgotPassword(
    @Arg('options') options: PasswordInput,
    @Arg('forgotPasswordToken') forgotPasswordToken: string
  ): Promise<void> {
    return await this.authController.resetPassword(forgotPasswordToken, options.password)
  }

  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(authUser)
  async sendEmailForVerification(@Ctx() context: MyContext): Promise<void> {
    return await this.authController.sendVerificationEmail(context)
  }

  @Mutation(() => Boolean, { nullable: true })
  async verifyUserEmailByActivationCode(
    @Arg('emailActivationCode') emailActivationCode: string
  ): Promise<void> {
    return await this.authController.verifyEmail(emailActivationCode)
  }
}
