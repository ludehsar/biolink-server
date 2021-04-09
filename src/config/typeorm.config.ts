import { ConnectionOptions } from 'typeorm'

import { User } from '../models/entities/User'
import { Project } from '../models/entities/Project'
import { __prod__ } from './app.config'
import { dbHost, dbPort, dbName, dbUser, dbPassword } from './database.config'
import { Domain } from '../models/entities/Domain'
import { Settings } from '../models/entities/Settings'
import { Plan } from '../models/entities/Plan'
import { Link } from '../models/entities/Link'
import { Tax } from '../models/entities/Tax'
import { Page } from '../models/entities/Page'
import { Code } from '../models/entities/Code'

const options: ConnectionOptions = {
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  database: dbName,
  username: dbUser,
  password: dbPassword,
  logging: !__prod__,
  synchronize: true,
  entities: [Code, Domain, Link, Page, Plan, Project, Settings, Tax, User],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
}

export default options
