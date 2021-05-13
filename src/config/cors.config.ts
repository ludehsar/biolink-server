import { CorsOptions } from 'cors'

const options: CorsOptions = {
  origin: [process.env.FRONTEND_APP_URL as string, 'http://localhost:3000'], // TODO: should be removed in production
  credentials: true,
}

export default options
