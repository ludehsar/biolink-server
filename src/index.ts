import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'

import mikroConfig from './config/mikro-orm.config'
import { __prod__, port, appKey } from './config/app.config'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from './resolvers/user'
import { MyContext } from './types'

const main = async () => {
  const orm = await MikroORM.init(mikroConfig)
  await orm.getMigrator().up()

  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
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
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
  })

  apolloServer.applyMiddleware({ app })

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`)
  })
}

main().catch((err) => {
  console.error(err)
})
