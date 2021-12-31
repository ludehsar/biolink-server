import { CodeType } from '../enums'
import { User } from '../entities'

export interface CodeUpdateBody {
  code?: string
  discount?: number
  expireDate?: Date | null
  quantity?: number
  referrer?: User
  type?: CodeType
}
