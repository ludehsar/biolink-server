import randToken from 'rand-token'
import argon2 from 'argon2'
import { User, Link, Biolink, Plan } from '../../entities'
import { LinkType } from '../../enums'
import { NewLinkInput } from '../../input-types'
import { LinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'
import { getRepository } from 'typeorm'

export const createNewLink = async (
  options: NewLinkInput,
  context: MyContext,
  user: User,
  biolinkId?: string
): Promise<LinkResponse> => {
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

  const currentLinksCount = await getRepository(Link)
    .createQueryBuilder('link')
    .where('link.userId = :userId', { userId: user.id })
    .getCount()

  const plan = (await user.plan) || (await Plan.findOne({ where: { name: 'Free' } }))

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

  if (
    planSettings.totalLinksLimit &&
    planSettings.totalLinksLimit !== -1 &&
    currentLinksCount >= planSettings.totalLinksLimit
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message: 'Maximum link limit reached. Please upgrade your account.',
        },
      ],
    }
  }

  let shortenedUrl = options.shortenedUrl ? options.shortenedUrl : randToken.generate(8)
  if (options.shortenedUrl) {
    const link = await Link.findOne({ where: { shortenedUrl: options.shortenedUrl } })

    if (link) {
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
    let link = await Link.findOne({ where: { shortenedUrl } })
    while (link) {
      shortenedUrl = randToken.generate(8)
      link = await Link.findOne({ where: { shortenedUrl } })
    }
  }

  try {
    const link = Link.create({
      linkTitle: options.linkTitle,
      linkType: options.linkType as LinkType,
      url: options.url,
      shortenedUrl,
      startDate: options.startDate,
      endDate: options.endDate,
      enablePasswordProtection: options.enablePasswordProtection,
      note: options.note,
    })

    if (options.enablePasswordProtection) {
      if (!options.password) {
        return {
          errors: [
            {
              errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
              message: 'Password is not defined',
            },
          ],
        }
      }
      const password = await argon2.hash(options.password)
      link.password = password
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
    }

    link.user = Promise.resolve(user)

    await link.save()

    // Capture user log
    await captureUserActivity(user, context, `Created new link ${link.url}`)

    return { link }
  } catch (err) {
    switch (err.constraint) {
      case 'UQ_d0d8043be438496bc31c73e9ed5': {
        return {
          errors: [
            {
              errorCode: ErrorCode.SHORTENED_URL_ALREADY_EXISTS,
              message: 'Shortened URL already taken',
            },
          ],
        }
      }
      default: {
        return {
          errors: [
            {
              errorCode: ErrorCode.DATABASE_ERROR,
              message: 'Something went wrong',
            },
          ],
        }
      }
    }
  }
}
