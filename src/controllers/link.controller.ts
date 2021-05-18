import { getRepository } from 'typeorm'
import moment from 'moment'
import randToken from 'rand-token'

import { Link } from '../models/entities/Link'
import { Biolink } from '../models/entities/Biolink'
import { User } from '../models/entities/User'
import { LinkType } from '../models/enums/LinkType'
import { EnabledStatus } from '../models/enums/EnabledStatus'
import { MyContext } from '../MyContext'
import { trackLink } from './analytics.controller'
import { captureUserActivity } from './logs.controller'
import { LinkResponse, NewLinkInput } from '../typeDefs/link.typeDef'

export const getAllLinksFromBiolinkUsername = async (
  username: string,
  showOnPage: boolean,
  currentUser: User
): Promise<LinkResponse> => {
  const biolink = await Biolink.findOne({ where: { username: username } })

  if (!biolink) {
    return {
      errors: [
        {
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

export const getAllUserLinks = async (user: User): Promise<LinkResponse> => {
  if (!user) {
    return {
      errors: [
        {
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const links = await Link.find({
    where: {
      userId: user.id,
    },
    order: {
      createdAt: 'DESC',
    },
  })

  return { links }
}

export const createLinkFromUsername = async (
  username: string,
  options: NewLinkInput,
  user: User,
  context: MyContext
): Promise<LinkResponse> => {
  const biolink = await Biolink.findOne({ where: { username } })

  if (!biolink) {
    return {
      errors: [
        {
          message: 'Biolink not found',
        },
      ],
    }
  }

  if (!user || biolink.userId !== user.id) {
    return {
      errors: [
        {
          message: 'Not authorized',
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

  const order = await Link.createQueryBuilder().where({ biolink }).getCount()

  try {
    const link = await Link.create({
      linkType: options.linkType as LinkType,
      url: options.url,
      shortenedUrl,
      startDate: options.startDate,
      endDate: options.endDate,
      status: options.status as EnabledStatus,
      biolink,
      user,
      order,
    }).save()

    // Capture user log
    await captureUserActivity(user, context, `Created new link ${link.url}`)

    return { link }
  } catch (err) {
    switch (err.constraint) {
      case 'UQ_d0d8043be438496bc31c73e9ed5': {
        return {
          errors: [
            {
              message: 'Shortened URL already taken',
            },
          ],
        }
      }
      default: {
        return {
          errors: [
            {
              message: 'Something went wrong',
            },
          ],
        }
      }
    }
  }
}

export const createNewLink = async (
  options: NewLinkInput,
  user: User,
  context: MyContext
): Promise<LinkResponse> => {
  if (!user) {
    return {
      errors: [
        {
          message: 'Not authorized',
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
    const link = await Link.create({
      linkType: options.linkType as LinkType,
      url: options.url,
      shortenedUrl,
      startDate: options.startDate,
      endDate: options.endDate,
      status: options.status as EnabledStatus,
      user,
    }).save()

    // Capture user log
    await captureUserActivity(user, context, `Created new link ${link.url}`)

    return { link }
  } catch (err) {
    switch (err.constraint) {
      case 'UQ_d0d8043be438496bc31c73e9ed5': {
        return {
          errors: [
            {
              message: 'Shortened URL already taken',
            },
          ],
        }
      }
      default: {
        return {
          errors: [
            {
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
  user: User
): Promise<LinkResponse> => {
  const link = await Link.findOne({ where: { shortenedUrl } })

  if (!link) {
    return {
      errors: [
        {
          message: 'No link found',
        },
      ],
    }
  }

  if (
    (!user || user.id !== link.userId) &&
    (link.status === ('Disabled' as EnabledStatus) ||
      (link.startDate <= moment().toDate() && link.endDate >= moment().toDate()))
  ) {
    return {
      errors: [
        {
          message: 'Not authorized',
        },
      ],
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
          message: 'No link found',
        },
      ],
    }
  }

  if (!user || user.id !== link.userId) {
    return {
      errors: [
        {
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
