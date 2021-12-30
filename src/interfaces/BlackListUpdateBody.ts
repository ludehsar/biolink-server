import { BlacklistType } from '../enums'

export interface BlackListUpdateBody {
  blacklistType?: BlacklistType
  keyword?: string
  reason?: string
}
