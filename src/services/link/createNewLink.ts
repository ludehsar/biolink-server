import { Brackets, getConnection, getRepository } from 'typeorm'
import { validate } from 'class-validator'
import randToken from 'rand-token'
import argon2 from 'argon2'
import { createWriteStream } from 'fs'
import path from 'path'

import { User, Link, Biolink, Plan } from '../../entities'
import { LinkType } from '../../enums'
import { NewLinkInput } from '../../input-types'
import { ErrorResponse, LinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'
import { BACKEND_URL } from '../../config'
import { isMalicious } from '../../utilities'

export const createNewLink = async (
  options: NewLinkInput,
  context: MyContext,
  user: User,
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

  let currentLinksCount = 0

  if (options.linkType === LinkType.Link || options.linkType === LinkType.Embed) {
    currentLinksCount = await getRepository(Link)
      .createQueryBuilder('link')
      .where('link.userId = :userId', { userId: user.id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('link.linkType = :linkType', { linkType: LinkType.Link }).orWhere(
            'link.linkType = :linkType',
            { linkType: LinkType.Embed }
          )
        })
      )
      .getCount()
  } else if (options.linkType === LinkType.Social) {
    currentLinksCount = await getRepository(Link)
      .createQueryBuilder('link')
      .where('link.userId = :userId', { userId: user.id })
      .andWhere('link.linkType = :linkType', { linkType: LinkType.Social })
      .getCount()
  }

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
    options.linkType !== LinkType.Line &&
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

  if (options.url) {
    const malicious = await isMalicious([options.url])

    if (malicious) {
      return {
        errors: [
          {
            errorCode: ErrorCode.LINK_IS_MALICIOUS,
            message: 'Malicious links detected',
          },
        ],
      }
    }
  }

  let shortenedUrl = '0' + randToken.generate(8)
  let otherLink = await Link.findOne({ where: { shortenedUrl } })
  while (otherLink) {
    shortenedUrl = '0' + randToken.generate(8)
    otherLink = await Link.findOne({ where: { shortenedUrl } })
  }

  try {
    const link = Link.create({
      linkTitle: options.linkTitle,
      linkType: options.linkType as LinkType,
      linkColor: options.linkColor || '#000',
      url: options.url,
      shortenedUrl,
      startDate: options.startDate,
      endDate: options.endDate,
      enablePasswordProtection: options.enablePasswordProtection,
      note: options.note,
      platform: options.platform || 'Unknown',
      icon: BACKEND_URL + `/static/socialIcons/${options.platform}.png`,
      featured: options.featured || false,
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

      if (options.linkType !== LinkType.Social) {
        await getConnection()
          .createQueryBuilder()
          .update(Link)
          .set({ order: () => '"order" + 1' })
          .where('biolinkId = :biolinkId', { biolinkId: biolink.id })
          .andWhere(
            new Brackets((qb) => {
              qb.where('linkType = :linkType', { linkType: LinkType.Link })
                .orWhere('linkType = :linkType', { linkType: LinkType.Embed })
                .orWhere('linkType = :linkType', { linkType: LinkType.Line })
            })
          )
          .execute()
      } else {
        await getConnection()
          .createQueryBuilder()
          .update(Link)
          .set({ order: () => '"order" + 1' })
          .where('biolinkId = :biolinkId', { biolinkId: biolink.id })
          .andWhere('linkType = :linkType', { linkType: LinkType.Social })
          .execute()
      }

      link.biolink = Promise.resolve(biolink)
      link.order = 0
    }

    if (options.linkImage) {
      const { createReadStream, filename } = options.linkImage
      const linkImageExt = filename.split('.').pop()
      const errors: ErrorResponse[] = []
      const linkImageName = `${randToken.generate(20)}-${Date.now().toString()}.${linkImageExt}`
      const directory = path.join(__dirname, `../../../assets/linkImages/${linkImageName}`)

      createReadStream()
        .pipe(createWriteStream(directory))
        .on('error', () => {
          errors.push({
            errorCode: ErrorCode.UPLOAD_ERROR,
            message: 'Unable to upload link image',
          })
        })

      if (errors.length > 0) {
        return {
          errors,
        }
      }

      link.linkImageUrl = BACKEND_URL + '/static/linkImages/' + linkImageName
    }

    link.user = Promise.resolve(user)

    await link.save()

    // Capture user log
    await captureUserActivity(user, context, `Created new link ${link.url}`, true)

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
        console.log(err.message)
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
