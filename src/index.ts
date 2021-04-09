import 'reflect-metadata'
import path from 'path'
import express from 'express'
import session from 'express-session'
import cors from 'cors'
import AdminBro from 'admin-bro'
import { ApolloServer } from 'apollo-server-express'
import { createConnection } from 'typeorm'
import { Database, Resource } from '@admin-bro/typeorm'
import { buildSchema } from 'type-graphql'

import sessionOptions from './config/session.config'
import { port } from './config/app.config'
import typeormOptions from './config/typeorm.config'
import corsOptions from './config/cors.config'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import adminbroOptions from './adminbro/admin.options'
import buildAdminRouter from './adminbro/admin.route'

const main = async () => {
  await createConnection(typeormOptions)

  const app = express()

  app.use(cors(corsOptions))

  app.use(session(sessionOptions))

  app.use('/static', express.static(path.join(__dirname, '../assets')))

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ req, res })
  })

  apolloServer.applyMiddleware({
    app,
    cors: false
  })

  AdminBro.registerAdapter({ Database, Resource })

  const adminBro = new AdminBro(adminbroOptions)

  app.use(adminBro.options.rootPath, buildAdminRouter(adminBro))

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`)
  })
}

main().catch((err) => {
  console.error(err)
})
