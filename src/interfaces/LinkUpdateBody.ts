import { FileUpload } from 'graphql-upload'

import { LinkType } from '../enums'
import { Biolink, User } from '../entities'

export interface LinkUpdateBody {
  biolink?: Biolink
  enablePasswordProtection?: boolean
  endDate?: Date | null
  featured?: boolean
  iconColorful?: string
  iconMinimal?: string
  linkColor?: string
  linkImage?: FileUpload
  linkTitle?: string
  linkType?: LinkType
  note?: string
  order?: number
  password?: string
  platform?: string
  shortenedUrl?: string
  startDate?: Date | null
  url?: string
  user?: User
}
