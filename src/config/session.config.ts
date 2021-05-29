import { redisOptions, COOKIE_NAME, COOKIE_SAMESITE, COOKIE_SECURE, appKey } from 'config'
import connectRedis from 'connect-redis'
import session, { SessionOptions } from 'express-session'
import redis from 'redis'

const RedisStore = connectRedis(session)
const redisClient = redis.createClient(redisOptions)

const options: SessionOptions = {
  name: COOKIE_NAME,
  store: new RedisStore({
    client: redisClient,
    disableTouch: true,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true, // prevent xss attack
    sameSite: COOKIE_SAMESITE, // lax: to prevent csrf
    secure: COOKIE_SECURE, // true: only works in https
  },
  saveUninitialized: false,
  secret: appKey,
  resave: false,
  proxy: true,
}

export default options
