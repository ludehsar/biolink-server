import { Mutation, InputType, Resolver, Field, Arg, Ctx, ObjectType, Query } from 'type-graphql'
import { MyContext } from 'types'
import * as argon2 from 'argon2'

import { User } from '../entities/User'

@InputType()
class LoginInput {
  @Field()
  username: string = ''

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
  async me (@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) {
      return null
    }

    const user = await em.findOne(User, { id: req.session.userId })
    return user
  }

  @Mutation(() => UserResponse)
  async register (
    @Arg('options') options: LoginInput, @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
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
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword
    })

    try {
      await em.persistAndFlush(user)
    } catch (err) {
      switch (err.code) {
        case '23505': {
          return {
            errors: [{
              field: 'username',
              message: 'User with this username already exists'
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

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => UserResponse)
  async login (
    @Arg('options') options: LoginInput, @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username })

    if (!user) {
      return {
        errors: [{
          field: 'username',
          message: 'Username not found'
        }]
      }
    }
    const valid = await argon2.verify(user.password, options.password)

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
}
