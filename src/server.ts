import 'reflect-metadata'
import path from 'path'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { createConnection } from 'typeorm'
import { buildSchema } from 'type-graphql'
import cookieParser from 'cookie-parser'
import { graphqlUploadExpress } from 'graphql-upload'
import { corsOptions, port } from './config'
import { stripeRoutes } from './routers'
import { MyContext } from './types'
import {
  SettingsResolver,
  UserResolver,
  CategoryResolver,
  BiolinkResolver,
  LinkResolver,
  PlanResolver,
  ReferralResolver,
  VerificationResolver,
} from './resolvers/app'
import { AuthResolver } from './resolvers/admin'
// import AdminBro from 'admin-bro'
// import { Database, Resource } from '@admin-bro/typeorm'
// import buildAdminRouter from './adminbro/admin.route'
// import adminbroOptions from './adminbro/admin.options'

const main = async (): Promise<void> => {
  // Configuring typeorm
  await createConnection()

  // Configure app
  const app = express()

  // Trust proxy
  app.set('trust proxy', true)

  // cors
  app.use(cors(corsOptions))

  // Cookie parser
  app.use(cookieParser())

  // static files, such as logo
  app.use('/static', express.static(path.join(__dirname, '../assets')))

  // Stripe router
  app.use('/api/stripe', stripeRoutes)

  // Configure graphql upload express middleware
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))

  // Configuring frontend app api
  const appServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        SettingsResolver,
        UserResolver,
        CategoryResolver,
        BiolinkResolver,
        LinkResolver,
        PlanResolver,
        ReferralResolver,
        VerificationResolver,
      ],
      validate: false,
    }),
    uploads: false,
    context: ({ req, res }): MyContext => ({ req, res }),
    playground: true, // TODO: disable playground in production
    introspection: true, // TODO: disable introspection in production
  })

  appServer.applyMiddleware({
    app,
    path: '/graphql',
    cors: false,
  })

  // Configuring admin app api
  const adminServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AuthResolver],
      validate: false,
    }),
    uploads: false,
    context: ({ req, res }): MyContext => ({ req, res }),
  })

  adminServer.applyMiddleware({
    app,
    path: '/admin/graphql',
    cors: false,
  })

  // Adminbro
  // AdminBro.registerAdapter({ Database, Resource })

  // const adminBro = new AdminBro(adminbroOptions)

  // app.use(adminBro.options.rootPath, buildAdminRouter(adminBro))

  // Listen to the port
  app.listen(port, () => {
    console.log(`🚀 Server ready at port ${port}.`)
  })
}

main().catch((err) => {
  console.error(err)
})
