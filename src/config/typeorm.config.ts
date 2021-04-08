import { ConnectionOptions } from 'typeorm'
import { User } from '../entities/User'
import { __prod__ } from './app.config'
import { dbHost, dbPort, dbName, dbUser, dbPassword } from './database.config'

const options: ConnectionOptions = {
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  database: dbName,
  username: dbUser,
  password: dbPassword,
  logging: !__prod__,
  synchronize: true,
  entities: [User],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
}

export default options
