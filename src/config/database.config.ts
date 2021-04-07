import 'dotenv/config'

export const dbType = <'postgres' | 'mysql' | 'mariadb' | 'cockroachdb' | 'sqlite' | 'mssql' | 'sap' | 'oracle' | 'cordova' | 'nativescript' | 'react-native' | 'sqljs' | 'mongodb' | 'aurora-data-api' | 'aurora-data-api-pg' | 'expo' | 'better-sqlite3'> process.env.DATABASE_TYPE || undefined
export const dbHost = process.env.DATABASE_HOST || 'localhost'
export const dbPort = parseInt(process.env.DATABASE_PORT || '') || 5432
export const dbName = process.env.DATABASE_NAME || 'dbname'
export const dbUser = process.env.DATABASE_USER || 'user'
export const dbPassword = process.env.DATABASE_PASSWORD || ''
