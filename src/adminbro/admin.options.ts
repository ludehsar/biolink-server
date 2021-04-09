import { AdminBroOptions } from 'admin-bro'

import { userOptions, userResource } from './user.resource'
import { Domain } from '../models/entities/Domain'
import { Plan } from '../models/entities/Plan'
import { Project } from '../models/entities/Project'
import { Settings } from '../models/entities/Settings'

const options: AdminBroOptions = {
  resources: [
    {
      resource: userResource,
      options: userOptions
    },
    {
      resource: Domain
    },
    {
      resource: Plan
    },
    {
      resource: Project
    },
    {
      resource: Settings
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
