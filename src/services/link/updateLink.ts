import { User, Link, Biolink } from 'entities'
import { LinkType } from 'enums'
import { NewLinkInput } from 'input-types'
import { LinkResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'
import argon2 from 'argon2'

export const updateLink = async (
  id: string,
  options: NewLinkInput,
  user: User,
  context: MyContext,
  username?: string
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

  console.log(link.userId, user.id)
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

  link.linkTitle = options.linkTitle
  link.note = options.note
  link.linkType = options.linkType as LinkType
  link.url = options.url
  link.startDate = options.startDate
  link.endDate = options.endDate
  link.enablePasswordProtection = options.enablePasswordProtection

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

  if (username) {
    const biolink = await Biolink.findOne({ where: { username } })

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
