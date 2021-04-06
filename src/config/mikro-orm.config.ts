import { appDebug } from './app.config'
import { MikroORM } from '@mikro-orm/core'
import path from 'path'

import { dbType, dbName, dbUser, dbPassword } from './database.config'
import { Post } from '../entities/Post'
import { User } from '../entities/User'

export default {
  migrations: {
    path: path.join(__dirname, '../migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/,
    disableForeignKeys: false
  },
  entities: [Post, User],
  debug: appDebug,
  type: dbType,
  dbName: dbName,
  user: dbUser,
  password: dbPassword
} as Parameters<typeof MikroORM.init>[0]
