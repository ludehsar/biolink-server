import { Service, User } from '../entities'

export interface OrderUpdateBody {
  description?: string
  price?: number
  orderCompleted?: boolean
  service?: Service
  buyer?: User
}
