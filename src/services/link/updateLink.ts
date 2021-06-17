import randToken from 'rand-token'
import { validate } from 'class-validator'
import argon2 from 'argon2'

import { User, Link, Biolink, Plan } from '../../entities'
import { LinkType } from '../../enums'
import { NewLinkInput } from '../../input-types'
import { LinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const updateLink = async (
  id: string,
  options: NewLinkInput,
  user: User,
  context: MyContext,
  biolinkId?: string
): Promise<LinkResponse> => {
  const validationErrors = await validate(options)
  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
    }
  }

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'Not authenticated',
        },
      ],
    }
  }

  const link = await Link.findOne(id)

  if (!link) {
    return {
      errors: [
        {
          errorCode: ErrorCode.LINK_COULD_NOT_BE_FOUND,
          message: 'Link not found',
        },
      ],
    }
  }

  if (link.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authorized',
        },
      ],
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

  let shortenedUrl = options.shortenedUrl ? options.shortenedUrl : randToken.generate(8)
  if (options.shortenedUrl) {
    const otherLink = await Link.findOne({ where: { shortenedUrl: options.shortenedUrl } })

    if (otherLink && otherLink.id !== link.id) {
      return {
        errors: [
          {
            errorCode: ErrorCode.SHORTENED_URL_ALREADY_EXISTS,
            message: 'Shortened URL already taken',
          },
        ],
      }
    }
  } else {
    let otherLink = await Link.findOne({ where: { shortenedUrl } })

    while (otherLink && otherLink.id !== link.id) {
      shortenedUrl = randToken.generate(8)
      otherLink = await Link.findOne({ where: { shortenedUrl } })
    }
  }

  link.linkTitle = options.linkTitle
  link.note = options.note
  link.linkType = options.linkType as LinkType
  link.url = options.url || ''
  link.shortenedUrl = shortenedUrl

  if (planSettings.linksSchedulingEnabled) {
    link.startDate = options.startDate
    link.endDate = options.endDate
  } else if (
    (options.startDate !== undefined && options.startDate.toString().length > 0) ||
    (options.endDate !== undefined && options.endDate.toString().length > 0)
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message:
            'Link scheduling is not supported with the current plan. Please upgrade your plan to continue.',
        },
      ],
    }
  }

  link.enablePasswordProtection = options.enablePasswordProtection

  if (options.enablePasswordProtection) {
    if (options.password) {
      const password = await argon2.hash(options.password)
      link.password = password
    } else if (link.password === null) {
      return {
        errors: [
          {
            errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
            message: 'Password is not defined',
          },
        ],
      }
    }
  } else {
    link.password = null
  }

  if (biolinkId) {
    const biolink = await Biolink.findOne(biolinkId)

    if (!biolink) {
      return {
        errors: [
          {
            errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
            message: 'Biolink not found',
          },
        ],
      }
    }

    if (!user || biolink.userId !== user.id) {
      return {
        errors: [
          {
            errorCode: ErrorCode.USER_NOT_AUTHORIZED,
            message: 'User not authorized',
          },
        ],
      }
    }

    link.biolink = Promise.resolve(biolink)
  } else {
    link.biolink = undefined
  }

  await link.save()

  // Capture user log
  await captureUserActivity(user, context, `Updated link ${link.url}`)

  return { link }
}
