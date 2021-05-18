import 'reflect-metadata'
import path from 'path'
import express from 'express'
import cors from 'cors'
import AdminBro from 'admin-bro'
import { ApolloServer } from 'apollo-server-express'
import { createConnection } from 'typeorm'
import { Database, Resource } from '@admin-bro/typeorm'
import { buildSchema } from 'type-graphql'
import cookieParser from 'cookie-parser'

import { port } from './config/app.config'
import corsOptions from './config/cors.config'
import { HelloResolver } from './resolvers/app/hello.appResolver'
import { UserResolver } from './resolvers/app/user.appResolver'
import adminbroOptions from './adminbro/admin.options'
import buildAdminRouter from './adminbro/admin.route'
import { MyContext } from './MyContext'
import { CategoryResolver } from './resolvers/app/category.appResolver'
import { BiolinkResolver } from './resolvers/app/biolink.appResolver'
import { LinkResolver } from './resolvers/app/link.appResolver'
import stripeRoutes from './routers/stripe.route'
import { SettingsResolver } from './resolvers/app/settings.appResolver'
import { PlanResolver } from './resolvers/app/plan.appResolver'
import { ReferralResolver } from './resolvers/app/referral.appResolver'
import { VerificationResolver } from './resolvers/app/verification.appResolver'
import { AnalyticsResolver } from './resolvers/app/analytics.appResolver'

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

  // Configuring apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        AnalyticsResolver,
        HelloResolver,
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
    context: ({ req, res }): MyContext => ({ req, res }),
    playground: true, // TODO: disable playground in production
    introspection: true, // TODO: disable introspection in production
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  })

  // Adminbro
  AdminBro.registerAdapter({ Database, Resource })

  const adminBro = new AdminBro(adminbroOptions)

  app.use(adminBro.options.rootPath, buildAdminRouter(adminBro))

  // Listen to the port
  app.listen(port, () => {
    console.log(`🚀 Server ready at port ${port}.`)
  })
}

main().catch((err) => {
  console.error(err)
})
