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
import { getStatisticsForAdmins } from '../services/analytics.service'
import { Request } from 'express'

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
      handler: async (req: Request) => {
        const {
          userRegistrationStartDate,
          userRegistrationEndDate,
          biolinkCreationStartDate,
          biolinkCreationEndDate,
          linkCreationStartDate,
          linkCreationEndDate,
        } = req.query
        const data = await getStatisticsForAdmins(
          (userRegistrationStartDate as unknown) as Date,
          (userRegistrationEndDate as unknown) as Date,
          (biolinkCreationStartDate as unknown) as Date,
          (biolinkCreationEndDate as unknown) as Date,
          (linkCreationStartDate as unknown) as Date,
          (linkCreationEndDate as unknown) as Date
        )
        return data
      },
      component: AdminBro.bundle('./statistics/components/layout.statistics.tsx'),
      icon: 'Activity',
    },
  },
}

export default options
