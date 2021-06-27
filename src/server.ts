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
  AnalyticsResolver,
  ReportResolver,
  SupportResolver,
} from './resolvers/app'
import {
  AdminRoleAdminResolver,
  AuthAdminResolver,
  BiolinkAdminResolver,
  BlackListAdminResolver,
  CategoryAdminResolver,
  CodeAdminResolver,
  LinkAdminResolver,
  PlanAdminResolver,
  UserAdminResolver,
  UsernameAdminResolver,
} from './resolvers/admin'

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

  app.use(
    express.json({
      // We need the raw body to verify webhook signatures.
      // Let's compute it only when hitting the Stripe webhook endpoint.
      verify: function (req: any, _, buf) {
        if (req.originalUrl.startsWith('/api/stripe/webhook')) {
          req.rawBody = buf.toString()
        }
      },
    })
  )

  // Stripe router
  app.use('/api/stripe', stripeRoutes)

  // Configure graphql upload express middleware
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))

  // Configuring frontend app api
  const appServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        AnalyticsResolver,
        SettingsResolver,
        UserResolver,
        CategoryResolver,
        BiolinkResolver,
        LinkResolver,
        PlanResolver,
        ReferralResolver,
        ReportResolver,
        SupportResolver,
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
      resolvers: [
        AdminRoleAdminResolver,
        AuthAdminResolver,
        BiolinkAdminResolver,
        BlackListAdminResolver,
        CategoryAdminResolver,
        CodeAdminResolver,
        LinkAdminResolver,
        PlanAdminResolver,
        UserAdminResolver,
        UsernameAdminResolver,
      ],
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

  // Listen to the port
  app.listen(port, () => {
    console.log(`🚀 Server ready at port ${port}.`)
  })
}

main().catch((err) => {
  console.error(err)
})
