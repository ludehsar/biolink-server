import { getRepository } from 'typeorm'
import moment from 'moment'
import randToken from 'rand-token'

import { Link } from '../models/entities/Link'
import { Biolink } from '../models/entities/Biolink'
import { LinkResponse, NewLinkInput } from '../resolvers/link.resolver'
import { User } from '../models/entities/User'
import { LinkType } from '../models/enums/LinkType'
import { EnabledStatus } from '../models/enums/EnabledStatus'

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
          field: '',
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
            field: '',
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

export const createLink = async (
  username: string,
  options: NewLinkInput,
  user: User
): Promise<LinkResponse> => {
  const biolink = await Biolink.findOne({ where: { username } })

  if (!biolink) {
    return {
      errors: [
        {
          field: '',
          message: 'Biolink not found',
        },
      ],
    }
  }

  if (!user || biolink.userId !== user.id) {
    return {
      errors: [
        {
          field: '',
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
            field: '',
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
      biolink,
      user,
    }).save()

    return { links: [link] }
  } catch (err) {
    switch (err.constraint) {
      case 'UQ_d0d8043be438496bc31c73e9ed5': {
        return {
          errors: [
            {
              field: '',
              message: 'Shortened URL already taken',
            },
          ],
        }
      }
      default: {
        return {
          errors: [
            {
              field: '',
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
  user: User
): Promise<LinkResponse> => {
  const link = await Link.findOne({ where: { shortenedUrl } })

  if (!link) {
    return {
      errors: [
        {
          field: '',
          message: 'No link found',
        },
      ],
    }
  }

  if ((!user || user.id !== link.userId) && link.status === ('Disabled' as EnabledStatus)) {
    return {
      errors: [
        {
          field: '',
          message: 'Not authorized',
        },
      ],
    }
  }

  return { links: [link] }
}

export const removeLinkByShortenedUrl = async (
  shortenedUrl: string,
  user: User
): Promise<LinkResponse> => {
  const link = await Link.findOne({ where: { shortenedUrl } })

  if (!link) {
    return {
      errors: [
        {
          field: '',
          message: 'No link found',
        },
      ],
    }
  }

  if (!user || user.id !== link.userId) {
    return {
      errors: [
        {
          field: '',
          message: 'Not authorized',
        },
      ],
    }
  }

  await link.softRemove()

  return { links: [link] }
}
