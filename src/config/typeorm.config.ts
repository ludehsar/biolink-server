import { ConnectionOptions } from 'typeorm'

import { User } from '../models/entities/User'
import { Project } from '../models/entities/Project'
import { __prod__ } from './app.config'
import { dbHost, dbPort, dbName, dbUser, dbPassword } from './database.config'
import { Domain } from '../models/entities/Domain'
import { Settings } from '../models/entities/Settings'
import { Plan } from '../models/entities/Plan'

const options: ConnectionOptions = {
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  database: dbName,
  username: dbUser,
  password: dbPassword,
  logging: !__prod__,
  synchronize: true,
  entities: [Domain, Plan, Project, Settings, User],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
}

export default options
