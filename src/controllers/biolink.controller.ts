import { validate } from 'class-validator'
import { Brackets, getRepository } from 'typeorm'
import moment from 'moment'

import { User } from '../models/entities/User'
import { Biolink } from '../models/entities/Biolink'
import { Category } from '../models/entities/Category'
import {
  NewBiolinkInput,
  BiolinkResponse,
  UpdateBiolinkProfileInput,
  UpdateBiolinkSettingsInput,
  BiolinkConnection,
} from '../resolvers/app/biolink.resolver'
import { PremiumUsername } from '../models/entities/PremiumUsername'
import { ValidationResponse } from '../resolvers/app/user.resolver'
import { BlackList } from '../models/entities/BlackList'
import { BlacklistType } from '../models/enums/BlacklistType'
import { BooleanResponse } from '../resolvers/app/commonTypes'
import { trackBiolink } from './analytics.controller'
import { MyContext } from '../MyContext'
import { captureUserActivity } from './logs.controller'
import { ConnectionArgs } from '../resolvers/app/relaySpec'

export const newBiolinkValidation = async (
  biolinkOptions: NewBiolinkInput
): Promise<ValidationResponse> => {
  // Checks input validatation
  const validationErrors = await validate(biolinkOptions)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        message: 'Not correctly formatted',
      })),
      passesValidation: false,
    }
  }

  // Checks blacklisted username
  const blacklisted = await BlackList.findOne({
    where: { blacklistType: BlacklistType.Username, keyword: biolinkOptions.username },
  })
  if (blacklisted) {
    return {
      errors: [
        {
          field: 'username',
          message: 'Cannot create account with this username.',
        },
      ],
      passesValidation: false,
    }
  }

  // Checks category
  const category = await Category.findOne({ where: { id: biolinkOptions.categoryId } })

  if (!category) {
    return {
      errors: [
        {
          field: 'categoryId',
          message: 'Category not found',
        },
      ],
      passesValidation: false,
    }
  }

  // Checks if username already exists
  const biolink = await Biolink.findOne({ where: { username: biolinkOptions.username } })
  if (biolink) {
    return {
      errors: [
        {
          field: 'username',
          message: 'Username has already been taken.',
        },
      ],
      passesValidation: false,
    }
  }

  // Checks premium username which has not yet purchased
  const premiumUsername = await PremiumUsername.findOne({
    where: { username: biolinkOptions.username },
  })

  if (premiumUsername && premiumUsername.ownerId !== null) {
    return {
      errors: [
        {
          field: 'username',
          message: 'Username has already been taken.',
        },
      ],
      passesValidation: false,
    }
  }

  return {
    passesValidation: true,
  }
}

export const createNewBiolink = async (
  options: NewBiolinkInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  const biolinkInputValidationReport = await newBiolinkValidation(options)
  if (!biolinkInputValidationReport.passesValidation) {
    return { errors: biolinkInputValidationReport.errors }
  }

  // Checks authorization
  if (!user) {
    return {
      errors: [
        {
          field: 'username',
          message: 'User not authorized',
        },
      ],
    }
  }

  // TODO: Uncomment if plan is defined
  // Checks plan
  // const currentBiolinkCount = await getRepository(User)
  //   .createQueryBuilder('user')
  //   .where({ id: user.id })
  //   .leftJoinAndSelect(Biolink, 'biolink', 'biolink.userId = user.id')
  //   .getCount()
  // const plan = await Plan.findOne({ where: { id: user.planId } })

  // if (!plan) {
  //   return {
  //     errors: [
  //       {
  //         field: 'username',
  //         message: 'Plan not defined',
  //       },
  //     ],
  //   }
  // }

  // if (
  //   plan.settings.totalBiolinksLimit !== -1 &&
  //   currentBiolinkCount >= plan.settings.totalBiolinksLimit
  // ) {
  //   return {
  //     errors: [
  //       {
  //         field: 'username',
  //         message: 'Current plan does not support creating another biolink.',
  //       },
  //     ],
  //   }
  // }

  // Creates biolink
  const category = await Category.findOne({ where: { id: options.categoryId } })

  const biolink = await Biolink.create({
    username: options.username,
    category,
    user: user,
  }).save()

  // Capture user log
  await captureUserActivity(user, context, `Created new biolink ${biolink.username}`)

  return { biolink }
}

export const getBiolinkFromUsername = async (
  username: string,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  const biolink = await Biolink.findOne({ where: { username } })
  const premiumUsername = await PremiumUsername.findOne({ where: { username } })

  if (!biolink || (premiumUsername && premiumUsername.ownerId !== biolink.userId)) {
    return {
      errors: [
        {
          field: 'username',
          message: 'Biolink not found',
        },
      ],
    }
  }

  if (user && user.id !== biolink.userId) {
    await trackBiolink(biolink, context)
  }

  return { biolink }
}

export const updateBiolinkFromUsername = async (
  user: User,
  username: string,
  options: UpdateBiolinkProfileInput,
  context: MyContext
): Promise<BiolinkResponse> => {
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

  if (biolink.userId !== user.id) {
    return {
      errors: [
        {
          field: '',
          message: 'User not authenticated',
        },
      ],
    }
  }

  await Biolink.update(biolink.id, options)

  await biolink.reload()

  await captureUserActivity(user, context, `Updated ${biolink.username} biolink details`)

  return { biolink }
}

export const updateBiolinkSettingsFromUsername = async (
  user: User,
  username: string,
  options: UpdateBiolinkSettingsInput,
  context: MyContext
): Promise<BiolinkResponse> => {
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

  if (biolink.userId !== user.id) {
    return {
      errors: [
        {
          field: '',
          message: 'User not authenticated',
        },
      ],
    }
  }

  // TODO: Configure settings according to user plans
  await Biolink.update(biolink.id, {
    settings: options,
  })

  await biolink.reload()

  await captureUserActivity(user, context, `Updated ${biolink.username} biolink settings`)

  return { biolink }
}

export const getAllDirectories = async (
  categoryId: number,
  options: ConnectionArgs
): Promise<BiolinkConnection> => {
  // Getting pageinfo
  const firstBiolink = await getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.category', 'category')
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(biolink.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.location) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.bio) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .orderBy('biolink.createdAt', 'ASC')
    .getOne()

  const lastBiolink = await getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.category', 'category')
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(biolink.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.location) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.bio) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .orderBy('biolink.createdAt', 'DESC')
    .getOne()

  // Getting before and after cursors from connection args
  let before = null
  if (options.before) before = Buffer.from(options.before, 'base64').toString()

  let after = null
  if (options.after)
    after = moment(Buffer.from(options.after, 'base64').toString())
      .add(1, 'second')
      .format('YYYY-MM-DD HH:mm:ss')

  // Gettings the directories and preparing objects
  const connection = new BiolinkConnection()
  const category = await Category.findOne(categoryId)

  const qb = getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.category', 'category')
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(biolink.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.location) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.bio) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (category) {
    qb.andWhere('biolink.categoryId = :categoryId', { categoryId })
  }

  if (before) {
    qb.andWhere('biolink.createdAt < :before', { before })
  }

  if (after) {
    qb.andWhere('biolink.createdAt > :after', { after })
  }

  qb.leftJoinAndSelect('biolink.user', 'user')

  if (options.first) {
    qb.limit(options.first)
  }

  const biolinks = await qb.getMany()

  // Checking if previous page and next page is present
  const dates = biolinks.map((c) => moment(c.createdAt))
  const minDate = moment.min(dates).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment.max(dates).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = biolinks.map((biolink) => ({
    node: biolink,
    cursor: Buffer.from(moment(biolink.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousBiolinks = await getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.category', 'category')
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(biolink.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.location) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.bio) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('biolink.createdAt < :minDate', { minDate })
    .getMany()

  const nextBiolinks = await getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.category', 'category')
    .where(`cast (biolink.settings->>'addedToDirectory' as boolean) = true`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(biolink.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(biolink.displayName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.location) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(biolink.bio) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(category.categoryName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('biolink.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstBiolink?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastBiolink?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextBiolinks.length,
    hasPreviousPage: !!previousBiolinks.length,
  }

  return connection
}

export const removeBiolinkByUsername = async (
  username: string,
  context: MyContext,
  user: User
): Promise<BooleanResponse> => {
  const biolink = await Biolink.findOne({ where: { username } })

  if (!user) {
    return {
      errors: [
        {
          message: 'User not authenticated',
        },
      ],
      executed: false,
    }
  }

  if (!biolink) {
    return {
      errors: [
        {
          message: 'No biolink found with this username',
        },
      ],
      executed: false,
    }
  }

  if (biolink.userId !== user.id) {
    return {
      errors: [
        {
          message: 'Not authorized',
        },
      ],
      executed: false,
    }
  }

  await biolink.softRemove()

  await captureUserActivity(user, context, `Removed biolink ${biolink.username}`)

  return {
    executed: true,
  }
}
