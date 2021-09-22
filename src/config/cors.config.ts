import { CorsOptions } from 'cors'
import { appConfig } from '../config'

const options: CorsOptions = {
  origin: [
    appConfig.FRONTEND_APP_URL,
    appConfig.ADMIN_APP_URL,
    'http://54.83.50.148',
    'http://54.165.248.251',
    'http://localhost:3000',
  ], // TODO: should be removed in production
  credentials: true,
}

export default options
