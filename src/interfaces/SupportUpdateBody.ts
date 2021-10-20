import { User } from '../entities'

export interface SupportUpdateBody {
  company?: string
  email?: string
  fullName?: string
  message?: string
  phoneNumber?: string
  subject?: string
  user?: User
}
