import { ApolloError, AuthenticationError } from 'apollo-server-errors'
import passport from 'passport'
import { MiddlewareFn } from 'type-graphql'

import { MyContext } from '../types'

export const authUser: MiddlewareFn = async ({ context }, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false },
      verifyCallback(context as MyContext, resolve, reject)
    )((context as MyContext).req, (context as MyContext).res, next)
  }).then(() => next())
}

const verifyCallback =
  (
    context: MyContext,
    resolve: (value?: unknown) => void,
    reject: (reason?: ApolloError) => void
  ): ((...args: any[]) => any) | undefined =>
  async (err, user, info) => {
    if (err || info || !user) {
      return reject(new AuthenticationError('User not authenticated'))
    }
    context.user = user

    resolve()
  }
