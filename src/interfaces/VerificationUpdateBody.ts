import { FileUpload } from 'graphql-upload'

import { Biolink, Category, User } from '../entities'
import { VerificationStatus } from '../enums'

export interface VerificationUpdateBody {
  biolink?: Biolink
  businessDocument?: FileUpload
  category?: Category
  email?: string
  firstName?: string
  instagramUrl?: string
  lastName?: string
  linkedinUrl?: string
  mobileNumber?: string
  otherDocuments?: FileUpload
  photoId?: FileUpload
  twitterUrl?: string
  user?: User
  username?: string
  websiteLink?: string
  workNumber?: string
  verificationStatus?: VerificationStatus
  verifiedEmail?: boolean
  verifiedGovernmentId?: boolean
  verifiedPhoneNumber?: boolean
  verifiedWorkEmail?: boolean
}
