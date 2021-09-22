import { AuthenticationError, ForbiddenError } from 'apollo-server-errors'
import passport from 'passport'
import { ArgsDictionary, MiddlewareFn } from 'type-graphql'

import { MyContext } from '../types'

export const authUser: MiddlewareFn = async ({ context, args }, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false },
      verifyCallback(context as MyContext, resolve, reject, args)
    )((context as MyContext).req, (context as MyContext).res, next)
  })
    .then(() => next())
    .catch(() => {
      throw new AuthenticationError('User not authenticated')
    })
}

const verifyCallback =
  (
    context: MyContext,
    resolve: (value?: unknown) => void,
    reject: (reason?: any) => void,
    args: ArgsDictionary
  ): ((...args: any[]) => any) | undefined =>
  async (err, user, info) => {
    if (err || info || !user) {
      return reject(new AuthenticationError('User not authenticated'))
    }
    context.user = user

    if (args.userId && args.userId !== user.id) {
      return reject(new ForbiddenError('Forbidden'))
    }

    resolve()
  }
