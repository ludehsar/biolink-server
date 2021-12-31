import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-errors'
import { User } from '../entities'
import passport from 'passport'
import { MiddlewareFn } from 'type-graphql'

import { MyContext } from '../types'

export function authAdmin(role?: string): MiddlewareFn {
  return async ({ context }, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(context as MyContext, resolve, reject, role)
      )((context as MyContext).req, (context as MyContext).res, next)
    }).then(() => next())
  }
}

const verifyCallback =
  (
    context: MyContext,
    resolve: (value?: unknown) => void,
    reject: (reason?: ApolloError) => void,
    requiredRole?: string
  ): ((...args: any[]) => any) | undefined =>
  async (err, user: User, info) => {
    if (err || info || !user) {
      return reject(new AuthenticationError('User not authenticated'))
    }

    const role = await user.adminRole

    if (requiredRole) {
      const [resource, permission] = requiredRole.split('.')

      if (role) {
        const hasPermission =
          role.roleSettings &&
          role.roleSettings.find(
            (parameter) =>
              parameter.resource === resource &&
              parameter[
                permission as 'canShow' | 'canShowList' | 'canCreate' | 'canEdit' | 'canDelete'
              ] === true
          )

        if (hasPermission || role.roleName === 'Administrator') {
          context.user = user
          return resolve()
        }
      }
    } else if (role) {
      context.user = user
      return resolve()
    }

    reject(new ForbiddenError('Forbidden'))
  }
