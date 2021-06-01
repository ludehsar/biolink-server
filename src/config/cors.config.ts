import { CorsOptions } from 'cors'
import { FRONTEND_APP_URL, ADMIN_APP_URL } from '../config'

const options: CorsOptions = {
  origin: [FRONTEND_APP_URL, ADMIN_APP_URL, 'http://localhost:3000'], // TODO: should be removed in production
  credentials: true,
}

export default options
