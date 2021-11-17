import httpStatus from 'http-status'
import passport from 'passport'
import { ApiError } from '../utilities'

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'))
  }
  req.user = user

  resolve()
}

export const auth = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(
      req,
      res,
      next
    )
  })
    .then(() => next())
    .catch((err) => next(err))
}
