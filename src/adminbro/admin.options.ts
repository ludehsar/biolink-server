import AdminBro, { AdminBroOptions } from 'admin-bro'

import { appConfig } from '../config'
import { logsResources, logsOptions } from './resources/activity/logs.options'
import { adminRoleResources, adminRoleOptions } from './resources/admin-role/adminRoles.options'
import { biolinkResource, biolinkOptions } from './resources/biolink/biolink.options'
import { blacklistResource, blacklistOptions } from './resources/black-list/blacklist.options'
import { categoryResource, categoryOptions } from './resources/category/category.options'
import { codeResource, codeOptions } from './resources/code/code.options'
import { domainResource, domainOptions } from './resources/domain/domain.options'
import { linkResource, linkOptions } from './resources/link/link.options'
import { planResource, planOptions } from './resources/plan/plan.options'
import { taxResource, taxOptions } from './resources/tax/tax.options'
import { userResource, userOptions } from './resources/user/user.resource'
import {
  verificationResource,
  verificationOptions,
} from './resources/verification/verification.options'

const options: AdminBroOptions = {
  resources: [
    {
      resource: userResource,
      options: userOptions,
    },
    {
      resource: adminRoleResources,
      options: adminRoleOptions,
    },
    {
      resource: categoryResource,
      options: categoryOptions,
    },
    {
      resource: biolinkResource,
      options: biolinkOptions,
    },
    {
      resource: planResource,
      options: planOptions,
    },
    {
      resource: linkResource,
      options: linkOptions,
    },
    {
      resource: domainResource,
      options: domainOptions,
    },
    {
      resource: blacklistResource,
      options: blacklistOptions,
    },
    {
      resource: verificationResource,
      options: verificationOptions,
    },
    {
      resource: codeResource,
      options: codeOptions,
    },
    {
      resource: taxResource,
      options: taxOptions,
    },
    {
      resource: logsResources,
      options: logsOptions,
    },
  ],
  locale: {
    language: 'en',
    translations: {
      labels: {
        Verification: 'Verification Center',
      },
    },
  },
  rootPath: '/admin',
  branding: {
    companyName: '',
    logo: '/static/logo2.png',
    softwareBrothers: false,
  },
  env: {
    BACKEND_URL: appConfig.BACKEND_URL,
  },
  dashboard: {
    component: AdminBro.bundle('./dashboard/components/dashboard.tsx'),
  },
}

export default options
