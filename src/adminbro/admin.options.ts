import AdminBro, { AdminBroOptions } from 'admin-bro'

import { userOptions, userResource } from './users/user.resource'
import { Domain } from '../models/entities/Domain'
import { Plan } from '../models/entities/Plan'
import { Project } from '../models/entities/Project'
import { Settings } from '../models/entities/Settings'
import { Code } from '../models/entities/Code'
import { Tax } from '../models/entities/Tax'
import { TrackLink } from '../models/entities/TrackLink'
import { categoryOptions, categoryResource } from './category.options'
import { blacklistOptions, blacklistResource } from './blacklist.options'
import { premiumUsernameOptions, premiumUsernameResource } from './premiumUsername.options'
import { linkOptions, linkResource } from './links/link.options'

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
      resource: premiumUsernameResource,
      options: premiumUsernameOptions,
    },
    {
      resource: linkResource,
      options: linkOptions,
    },
    {
      resource: Code,
    },
    {
      resource: Domain,
    },
    {
      resource: Plan,
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
