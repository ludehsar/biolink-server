import { AdminBroOptions } from 'admin-bro'

import { userOptions, userResource } from './user.resource'
import { Domain } from '../models/entities/Domain'
import { Plan } from '../models/entities/Plan'
import { Project } from '../models/entities/Project'
import { Settings } from '../models/entities/Settings'
import { Link } from '../models/entities/Link'
import { Page } from '../models/entities/Page'
import { Code } from '../models/entities/Code'
import { Tax } from '../models/entities/Tax'
import { BlackList } from '../models/entities/BlackList'
import { Category } from '../models/entities/Category'
import { PremiumUsername } from '../models/entities/PremiumUsername'
import { TrackLink } from '../models/entities/TrackLink'
import { UserLogs } from '../models/entities/UserLogs'

const options: AdminBroOptions = {
  resources: [
    {
      resource: userResource,
      options: userOptions
    },
    {
      resource: BlackList
    },
    {
      resource: Category
    },
    {
      resource: Code
    },
    {
      resource: Domain
    },
    {
      resource: Link
    },
    {
      resource: Page
    },
    {
      resource: Plan
    },
    {
      resource: PremiumUsername
    },
    {
      resource: Project
    },
    {
      resource: Settings
    },
    {
      resource: Tax
    },
    {
      resource: TrackLink
    },
    {
      resource: UserLogs
    }
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Linkby',
    logo: '../../static/logo.png',
    softwareBrothers: false
  }
}

export default options
