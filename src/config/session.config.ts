import redisOptions from './redis.config'
import connectRedis from 'connect-redis'
import session, { SessionOptions } from 'express-session'
import redis from 'redis'

import { appConfig } from '../config'

const RedisStore = connectRedis(session)
const redisClient = redis.createClient(redisOptions)

const options: SessionOptions = {
  name: appConfig.COOKIE_NAME,
  store: new RedisStore({
    client: redisClient,
    disableTouch: true,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true, // prevent xss attack
    sameSite: appConfig.COOKIE_SAMESITE, // lax: to prevent csrf
    secure: appConfig.COOKIE_SECURE, // true: only works in https
  },
  saveUninitialized: false,
  secret: appConfig.appKey,
  resave: false,
  proxy: true,
}

export default options
