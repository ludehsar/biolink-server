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
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import adminbroOptions from './adminbro/admin.options'
import buildAdminRouter from './adminbro/admin.route'
import { MyContext } from './MyContext'
import { CategoryResolver } from './resolvers/category'

const main = async (): Promise<void> => {
  // Configuring typeorm
  await createConnection()

  // Configure app
  const app = express()

  // cors
  app.use(cors(corsOptions))

  // Cookie parser
  app.use(cookieParser())

  // static files, such as logo
  app.use('/static', express.static(path.join(__dirname, '../assets')))

  // Configuring apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, CategoryResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res }),
  })

  apolloServer.applyMiddleware({
    app,
    cors: false,
  })

  // Adminbro
  AdminBro.registerAdapter({ Database, Resource })

  const adminBro = new AdminBro(adminbroOptions)

  app.use(adminBro.options.rootPath, buildAdminRouter(adminBro))

  app.listen(port, () => {
    console.log(`🚀 Server ready at port ${port}.`)
  })
}

main().catch((err) => {
  console.error(err)
})
