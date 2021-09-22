const dbType =
  <
    | 'postgres'
    | 'mysql'
    | 'mariadb'
    | 'cockroachdb'
    | 'sqlite'
    | 'mssql'
    | 'sap'
    | 'oracle'
    | 'cordova'
    | 'nativescript'
    | 'react-native'
    | 'sqljs'
    | 'mongodb'
    | 'aurora-data-api'
    | 'aurora-data-api-pg'
    | 'expo'
    | 'better-sqlite3'
  >process.env.DATABASE_TYPE || undefined
const dbHost = process.env.DATABASE_HOST || 'localhost'
const dbPort = parseInt(process.env.DATABASE_PORT || '') || 5432
const dbName = process.env.DATABASE_NAME || 'dbname'
const dbUser = process.env.DATABASE_USER || 'user'
const dbPassword = process.env.DATABASE_PASSWORD || ''

export default { dbHost, dbName, dbPassword, dbPort, dbType, dbUser }
