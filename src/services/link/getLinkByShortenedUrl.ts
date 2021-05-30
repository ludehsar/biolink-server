import argon2 from 'argon2'
import moment from 'moment'
import { User, Link, Plan } from '../../entities'
import { LinkResponse } from '../../object-types'
import { trackLinkClicks } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const getLinkByShortenedUrl = async (
  shortenedUrl: string,
  context: MyContext,
  user: User,
  password?: string
): Promise<LinkResponse> => {
  const link = await Link.findOne({ where: { shortenedUrl } })

  if (!link) {
    return {
      errors: [
        {
          errorCode: ErrorCode.LINK_COULD_NOT_BE_FOUND,
          message: 'No link found',
        },
      ],
    }
  }

  if (
    (!user || user.id !== link.userId) &&
    ((link.startDate && link.startDate > moment().toDate()) ||
      (link.endDate && link.endDate < moment().toDate()))
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'Not authorized',
        },
      ],
    }
  }

  if (link.enablePasswordProtection && password == null) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'Enter password to access the link',
        },
      ],
    }
  } else if (link.enablePasswordProtection) {
    const verifiedPasswordCheck = await argon2.verify(link.password as string, password as string)

    if (!verifiedPasswordCheck) {
      return {
        errors: [
          {
            errorCode: ErrorCode.PASSWORD_DID_NOT_MATCH,
            message: 'Password did not match',
          },
        ],
      }
    }
  }

  const plan = (await user.plan) || Plan.findOne({ where: { name: 'Free' } })

  if (!plan) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PLAN_COULD_NOT_BE_FOUND,
          message: 'Plan not defined',
        },
      ],
    }
  }

  const planSettings = plan.settings || {}

  if (planSettings.utmParametersEnabled) {
    const biolink = await link.biolink

    if (biolink) {
      const biolinkSettings = biolink.settings

      if (biolinkSettings.enableUtmParameters) {
        if (link.url.includes('?'))
          link.url += `&utm_medium=${biolinkSettings.utmMedium}&utm_source=${biolinkSettings.utmSource}&utm_campaign=${biolinkSettings.utmCampaign}`
        else
          link.url += `?utm_medium=${biolinkSettings.utmMedium}&utm_source=${biolinkSettings.utmSource}&utm_campaign=${biolinkSettings.utmCampaign}`
      }
    }
  }

  await trackLinkClicks(link, context)

  return { link }
}
