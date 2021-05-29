import AdminBro, { AdminBroOptions } from 'admin-bro'
import { adminRoleResources, adminRoleOptions } from './adminRoles/adminRoles.options'
import { biolinkResource, biolinkOptions } from './biolink.options'
import { blacklistResource, blacklistOptions } from './blacklist.options'
import { categoryResource, categoryOptions } from './category.options'
import { codeResource, codeOptions } from './code.options'
import { domainResource, domainOptions } from './domain.options'
import { linkResource, linkOptions } from './link.options'
import { logsResources, logsOptions } from './logs.options'
import { planResource, planOptions } from './plan/plan.options'
import { premiumUsernameResource, premiumUsernameOptions } from './premiumUsername.options'
import { settingsResource, settingsOptions } from './settings/settings.options'
import { taxResource, taxOptions } from './tax.options'
import { userOptions, userResource } from './users/user.resource'
import { verificationResource, verificationOptions } from './verification.options'

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
    companyName: 'Linkby',
    logo: '/static/logo.png',
    softwareBrothers: false,
  },
  dashboard: {
    component: AdminBro.bundle('./dashboard/components/dashboard.tsx'),
  },
}

export default options
