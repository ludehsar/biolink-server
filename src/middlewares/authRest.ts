import passport from 'passport'
import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'

import { ApiError } from '../utilities'

const verifyCallback =
  (
    req: Request,
    resolve: (value?: unknown) => void,
    reject: (reason?: ApiError) => void
  ): ((...args: any[]) => any) | undefined =>
  async (err, user, info) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'))
    }
    req.user = user
    resolve()
  }

export const authRest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(
      req,
      res,
      next
    )
  }).then(() => next())
}
