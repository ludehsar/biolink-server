require('dotenv').config()

module.exports = {
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  logging: true,
  synchronize: false,
  entities: ['build/entities/**/*.js'],
  migrations: ['build/migrations/**/*.js'],
  subscribers: ['build/subscribers/**/*.js'],
  cli: {
    entitiesDir: 'build/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers'
  },
  ssl: true,
  extra: {
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false,
    } : false,
  }
}
