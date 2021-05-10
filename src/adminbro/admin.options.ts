import AdminBro, { AdminBroOptions } from 'admin-bro'

import { userOptions, userResource } from './users/user.resource'
import { categoryOptions, categoryResource } from './category.options'
import { blacklistOptions, blacklistResource } from './blacklist.options'
import { premiumUsernameOptions, premiumUsernameResource } from './premiumUsername.options'
import { linkOptions, linkResource } from './link.options'
import { domainOptions, domainResource } from './domain.options'
import { biolinkOptions, biolinkResource } from './biolink.options'
import { codeOptions, codeResource } from './code.options'
import { taxOptions, taxResource } from './tax.options'
import { planOptions, planResource } from './plan/plan.options'
import { settingsOptions, settingsResource } from './settings/settings.options'
import statisticsHandler from './statistics/actions/statisticsHandler'
import { verificationOptions, verificationResource } from './verification.options'
import { adminRoleOptions, adminRoleResources } from './adminRoles/adminRoles.options'

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
      resource: settingsResource,
      options: settingsOptions,
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
    companyName: 'Linkby',
    logo: '/static/logo.png',
    softwareBrothers: false,
  },
  dashboard: {
    component: AdminBro.bundle('./dashboard/components/dashboard.tsx'),
  },
  pages: {
    Statistics: {
      handler: statisticsHandler,
      component: AdminBro.bundle('./statistics/components/layout.statistics.tsx'),
      icon: 'Activity',
    },
  },
}

export default options
