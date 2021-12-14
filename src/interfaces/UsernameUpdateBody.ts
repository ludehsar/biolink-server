import { PremiumUsernameType } from '../enums'
import { Biolink, User } from '../entities'

export interface UsernameUpdateBody {
  biolink?: Biolink | null
  expireDate?: Date | null
  owner?: User | null
  premiumType?: PremiumUsernameType
}
