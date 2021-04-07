import { Mutation, InputType, Resolver, Field, Arg, Ctx, ObjectType, Query } from 'type-graphql'
import { MyContext } from 'types'
import * as argon2 from 'argon2'

import { User } from '../entities/User'
import { COOKIE_NAME } from '../config/app.config'

@InputType()
class RegisterInput {
  @Field()
  email: string = ''

  @Field()
  username: string = ''

  @Field()
  password: string = ''
}

@InputType()
class LoginInput {
  @Field()
  email: string = ''

  @Field()
  password: string = ''
}

@ObjectType()
class FieldError {
  @Field()
  field: string = ''

  @Field()
  message: string = ''
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me (@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null
    }

    const user = await User.findOne(req.session.userId)
    return user
  }

  @Mutation(() => UserResponse)
  async register (
    @Arg('options') options: RegisterInput, @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const emailRegexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!emailRegexExp.test(options.email)) {
      return {
        errors: [{
          field: 'email',
          message: 'Email is not valid'
        }]
      }
    }

    if (options.username.length <= 2) {
      return {
        errors: [{
          field: 'username',
          message: 'Username must be greater than 2 characters'
        }]
      }
    }

    if (options.password.length < 8) {
      return {
        errors: [{
          field: 'password',
          message: 'Password must be at least 8 characters'
        }]
      }
    }

    const hashedPassword = await argon2.hash(options.password)

    try {
      const user = await User.create({
        email: options.email,
        username: options.username,
        encryptedPassword: hashedPassword
      }).save()

      req.session.userId = user.id

      return { user }
    } catch (err) {
      console.log(err)
      switch (err.constraint) {
        case 'UQ_78a916df40e02a9deb1c4b75edb': {
          return {
            errors: [{
              field: 'username',
              message: 'User with this username already exists'
            }]
          }
        }
        case 'UQ_e12875dfb3b1d92d7d7c5377e22': {
          return {
            errors: [{
              field: 'email',
              message: 'User with this email already exists'
            }]
          }
        }
        default: {
          return {
            errors: [{
              field: 'username',
              message: 'Something went wrong'
            }]
          }
        }
      }
    }
  }

  @Mutation(() => UserResponse)
  async login (
    @Arg('options') options: LoginInput, @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email: options.email } })

    if (!user) {
      return {
        errors: [{
          field: 'email',
          message: 'Email not found'
        }]
      }
    }
    const valid = await argon2.verify(user.encryptedPassword, options.password)

    if (!valid) {
      return {
        errors: [{
          field: 'password',
          message: 'Incorrect password'
        }]
      }
    }

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => Boolean)
  async verifyEmail (): Promise<Boolean> {
    // TODO: implement email verification
    return true
  }

  @Mutation(() => Boolean)
  async forgotPassword (): Promise<Boolean> {
    // TODO: implement forgot password
    return true
  }

  @Mutation(() => Boolean)
  async changePassword (): Promise<Boolean> {
    // TODO: implement change password
    return true
  }

  @Mutation(() => Boolean)
  logout (@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy(err => {
        if (err) {
          resolve(false)
          return
        }

        res.clearCookie(COOKIE_NAME)
        resolve(true)
      })
    )
  }
}
