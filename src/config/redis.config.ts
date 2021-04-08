import { ClientOpts } from 'redis'

const options: ClientOpts = {
  url: process.env.REDIS_ENDPOINT,
  password: process.env.REDIS_PASSWORD
}

export default options
