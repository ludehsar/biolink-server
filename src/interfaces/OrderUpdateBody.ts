import { Service, User } from '../entities'

export interface ServiceUpdateBody {
  description?: string
  price?: number
  orderCompleted?: boolean
  service?: Service
  buyer?: User
}
