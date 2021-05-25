import { getRepository } from 'typeorm'
import moment from 'moment'
import randToken from 'rand-token'
import * as argon2 from 'argon2'

import { Link } from '../../models/entities/Link'
import { Biolink } from '../../models/entities/Biolink'
import { User } from '../../models/entities/User'
import { LinkType } from '../../models/enums/LinkType'
import { MyContext } from '../../MyContext'
import { trackLink } from './analytics.controller'
import { captureUserActivity } from './logs.controller'
import { LinkListResponse, LinkResponse, NewLinkInput } from '../../typeDefs/link.typeDef'
import { ErrorCode } from '../../constants/errorCodes'

export const getAllLinksFromBiolinkUsername = async (
  username: string,
  showOnPage: boolean,
  currentUser: User
): Promise<LinkListResponse> => {
  const biolink = await Biolink.findOne({ where: { username: username } })

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

  const qb = getRepository(Link).createQueryBuilder('link').where({
    biolink,
  })

  if (showOnPage) {
    qb.andWhere(
      `(link.startDate IS NULL AND link.endDate IS NULL) OR (link.startDate <= :currentDate AND link.endDate >= :currentDate)`,
      {
        currentDate: moment().toISOString(),
      }
    )
  } else {
    if (!currentUser || biolink.userId !== currentUser.id) {
      return {
        errors: [
          {
            errorCode: ErrorCode.USER_NOT_AUTHORIZED,
            message: 'User is not authorized',
          },
        ],
      }
    }
  }

  qb.orderBy('link.order', 'ASC')

  const links = await qb.getMany()

  return { links }
}

export const getAllUserLinks = async (user: User): Promise<LinkListResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const links = await Link.find({
    where: {
      user,
    },
    order: {
      createdAt: 'DESC',
    },
  })

  return { links }
}

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
      linkType: options.linkType as LinkType,
      url: options.url,
      shortenedUrl,
      startDate: options.startDate,
      endDate: options.endDate,
      enablePasswordProtection: options.enablePasswordProtection,
      user,
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

    if (username !== null) {
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

      link.biolink = biolink
    }

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
    link.startDate <= moment().toDate() &&
    link.endDate >= moment().toDate()
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

  await trackLink(link, context)

  return { link }
}

export const removeLinkByShortenedUrl = async (
  shortenedUrl: string,
  user: User,
  context: MyContext
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

  if (!user || user.id !== link.userId) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'Not authorized',
        },
      ],
    }
  }

  await link.softRemove()

  // Capture user log
  await captureUserActivity(user, context, `Link ${link.url} removed`)

  return { link }
}
