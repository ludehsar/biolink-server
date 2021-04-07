import 'reflect-metadata'
import express from 'express'
import * as argon2 from 'argon2'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import AdminBro from 'admin-bro'
import AdminBroExpress from '@admin-bro/express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { Database, Resource } from '@admin-bro/typeorm'

import options from './adminbro/admin.options'
import { __prod__, port, appKey, COOKIE_NAME, COOKIE_SAMESITE, COOKIE_SECURE } from './config/app.config'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import { MyContext } from './types'
import { dbHost, dbPort, dbName, dbPassword, dbUser } from './config/database.config'
import { redisEndpoint, redisPassword } from './config/redis.config'
import { User } from './entities/User'

const main = async () => {
  await createConnection({
    type: 'postgres',
    host: dbHost,
    port: dbPort,
    database: dbName,
    username: dbUser,
    password: dbPassword,
    logging: !__prod__,
    synchronize: true,
    entities: [User],
    ssl: true,
    extra: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  })

  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient({
    url: redisEndpoint,
    password: redisPassword
  })

  app.use(cors({
    origin: process.env.FRONTEND_APP_URL,
    credentials: true
  }))

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // prevent xss attack
        sameSite: COOKIE_SAMESITE, // csrf
        secure: COOKIE_SECURE // only works in https
      },
      saveUninitialized: false,
      secret: appKey,
      resave: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({ req, res })
  })

  apolloServer.applyMiddleware({
    app,
    cors: false
  })

  AdminBro.registerAdapter({ Database, Resource })

  const adminBro = new AdminBro(options)

  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, password) => {
      const user = await User.findOne({ email })
      if (user) {
        const matched = await argon2.verify(user.encryptedPassword, password)
        if (matched) {
          return user
        }
      }
      return false
    },
    cookiePassword: appKey
  })
  app.use(adminBro.options.rootPath, router)

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`)
  })
}

main().catch((err) => {
  console.error(err)
})
