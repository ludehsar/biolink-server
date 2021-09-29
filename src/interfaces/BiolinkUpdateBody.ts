import { FileUpload } from 'graphql-upload'

import { Category, User, Username, Verification } from '../entities'
import { VerificationStatus } from '../enums'
import { BiolinkSettings } from '../json-types'

export interface BiolinkUpdateBody {
  bio?: string
  category?: Category
  changedUsername?: boolean
  city?: string
  country?: string
  coverPhoto?: FileUpload
  displayName?: string
  featured?: boolean
  latitude?: number
  longitude?: number
  profilePhoto?: FileUpload
  settings?: BiolinkSettings
  state?: string
  user?: User
  username?: Username
  verification?: Verification
  verificationStatus?: VerificationStatus
  verifiedEmail?: boolean
  verifiedGovernmentId?: boolean
  verifiedPhoneNumber?: boolean
  verifiedWorkEmail?: boolean
}
