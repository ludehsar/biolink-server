import 'reflect-metadata'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { createConnection } from 'typeorm'
import AdminBro from 'admin-bro'
import AdminBroExpress from '@admin-bro/express'
import { Database, Resource } from '@admin-bro/typeorm'
import * as argon2 from 'argon2'

import { __prod__, port, appKey, COOKIE_NAME } from './config/app.config'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import { MyContext } from './types'
import { dbHost, dbPort, dbName, dbPassword, dbUser } from './config/database.config'
import { User } from './entities/User'
import options from './adminbro/admin.options'

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
    entities: [User]
  })

  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

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
        sameSite: 'lax', // csrf
        secure: __prod__ // only works in https
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
