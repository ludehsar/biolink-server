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

const options: AdminBroOptions = {
  resources: [
    {
      resource: userResource,
      options: userOptions
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
      resource: Project
    },
    {
      resource: Settings
    },
    {
      resource: Tax
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
