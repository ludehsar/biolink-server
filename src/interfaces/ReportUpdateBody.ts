import { User } from '../entities'

export interface ReportUpdateBody {
  firstName?: string
  lastName?: string
  email?: string
  reportedUrl?: string
  description?: string
  user?: User
}
