import { CorsOptions } from 'cors'

const options: CorsOptions = {
  origin: process.env.FRONTEND_APP_URL,
  credentials: true
}

export default options
