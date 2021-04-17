import AdminBro, { AdminBroOptions } from 'admin-bro'

import { userOptions, userResource } from './users/user.resource'
import { categoryOptions, categoryResource } from './category.options'
import { blacklistOptions, blacklistResource } from './blacklist.options'
import { premiumUsernameOptions, premiumUsernameResource } from './premiumUsername.options'
import { linkOptions, linkResource } from './link.options'
import { domainOptions, domainResource } from './domain.options'
import { projectOptions, projectResource } from './project.options'
import { codeOptions, codeResource } from './code.options'
import { taxOptions, taxResource } from './tax.options'
import { planOptions, planResource } from './plan.options'

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
      resource: projectResource,
      options: projectOptions,
    },
    {
      resource: premiumUsernameResource,
      options: premiumUsernameOptions,
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
      resource: codeResource,
      options: codeOptions,
    },
    {
      resource: taxResource,
      options: taxOptions,
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
  pages: {
    Settings: {
      component: AdminBro.bundle('./settings/components/layout.settings.tsx'),
      icon: 'Settings',
    },
  },
}

export default options
