import { ForbiddenError } from 'apollo-server-express'
import { MiddlewareFn } from 'type-graphql'
import { MyContext } from 'types'

import { getAuthUser } from '../utilities'

export const emailVerified: MiddlewareFn = async ({ context }, next) => {
  const currentUser = await getAuthUser((context as MyContext).req, (context as MyContext).res)

  if (currentUser?.emailVerifiedAt !== null) {
    return next()
  }

  throw new ForbiddenError('Email is not verified')
}
