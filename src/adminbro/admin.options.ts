import AdminBro, { AdminBroOptions } from 'admin-bro'

import { userOptions, userResource } from './users/user.resource'
import { Domain } from '../models/entities/Domain'
import { Plan } from '../models/entities/Plan'
import { Project } from '../models/entities/Project'
import { Settings } from '../models/entities/Settings'
import { Link } from '../models/entities/Link'
import { Code } from '../models/entities/Code'
import { Tax } from '../models/entities/Tax'
import { PremiumUsername } from '../models/entities/PremiumUsername'
import { TrackLink } from '../models/entities/TrackLink'
import { categoryOptions, categoryResource } from './category.options'
import { blacklistOptions, blacklistResource } from './blacklist.options'

const options: AdminBroOptions = {
  resources: [
    {
      resource: userResource,
      options: userOptions,
    },
    {
      resource: categoryResource,
      options: categoryOptions,
    },
    {
      resource: blacklistResource,
      options: blacklistOptions,
    },
    {
      resource: Code,
    },
    {
      resource: Domain,
    },
    {
      resource: Link,
    },
    {
      resource: Plan,
    },
    {
      resource: PremiumUsername,
    },
    {
      resource: Project,
    },
    {
      resource: Settings,
    },
    {
      resource: Tax,
    },
    {
      resource: TrackLink,
    },
  ],
  rootPath: '/admin',
  branding: {
    companyName: 'Linkby',
    logo: '/static/logo.png',
    softwareBrothers: false,
  },
  dashboard: {
    component: AdminBro.bundle('./dashboard/components/dashboard.tsx'),
  },
}

export default options
