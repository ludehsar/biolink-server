import randToken from 'rand-token'
import argon2 from 'argon2'
import { User, Link, Biolink } from '../../entities'
import { LinkType } from '../../enums'
import { NewLinkInput } from '../../input-types'
import { LinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const createNewLink = async (
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

    link.user = Promise.resolve(user)

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
    }

    await link.save()

    console.log('User ID#:', link.userId)

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
