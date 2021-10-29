import { User } from '../entities'

export interface ServiceUpdateBody {
  title?: string
  description?: string
  blacklisted?: boolean
  price?: number
  seller?: User
}
