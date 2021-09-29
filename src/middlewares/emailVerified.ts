import { ForbiddenError } from 'apollo-server-express'
import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../types'

export const emailVerified: MiddlewareFn = async ({ context }, next) => {
  const currentUser = (context as MyContext).user

  if (currentUser?.emailVerifiedAt !== null) {
    return next()
  }

  throw new ForbiddenError('Email is not verified')
}
