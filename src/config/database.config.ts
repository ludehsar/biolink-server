import 'dotenv/config'

export const dbType = <'postgresql' | 'mongo' | 'mysql' | 'mariadb' | 'sqlite' | undefined> process.env.DATABASE_TYPE || undefined
export const dbName = process.env.DATABASE_NAME || 'dbname'
export const dbUser = process.env.DATABASE_USER || 'user'
export const dbPassword = process.env.DATABASE_PASSWORD || ''
