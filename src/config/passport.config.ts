import { Strategy, VerifyCallback, StrategyOptions, ExtractJwt } from 'passport-jwt'

import { User } from '../entities'
import { appConfig } from '../config'
import { TokenType } from '../enums'

const jwtOptions: StrategyOptions = {
  secretOrKey: appConfig.accessTokenSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    if (payload.type !== TokenType.Access) {
      throw new Error('Invalid token type')
    }

    const user = await User.findOne(payload.sub)

    if (!user) {
      return done(null, false)
    }

    done(null, user)
  } catch (error) {
    done(error, false)
  }
}

const jwtStrategy = new Strategy(jwtOptions, jwtVerify)

export default jwtStrategy
