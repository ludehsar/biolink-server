require('dotenv').config()

module.exports = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logging: false,
  synchronize: false,
  entities: ['build/models/entities/**/*.js'],
  migrations: ['build/migrations/**/*.js'],
  subscribers: ['build/subscribers/**/*.js'],
  cli: {
    entitiesDir: 'build/models/entities',
    migrationsDir: 'build/migrations',
    subscribersDir: 'build/subscribers'
  },
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
}
