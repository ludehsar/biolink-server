import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { User } from '../models/entities/User'
import { Biolink } from '../models/entities/Biolink'
import { Category } from '../models/entities/Category'
import {
  NewBiolinkInput,
  BiolinkResponse,
  UpdateBiolinkProfileInput,
  UpdateBiolinkSettingsInput,
} from '../resolvers/biolink.resolver'
import { PremiumUsername } from '../models/entities/PremiumUsername'
import { ValidationResponse } from '../resolvers/user.resolver'
import { BlackList } from '../models/entities/BlackList'
import { BlacklistType } from '../models/enums/BlacklistType'
import { Plan } from '../models/entities/Plan'
import { BooleanResponse } from '../resolvers/commonTypes'

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

  // Checks plan
  const currentBiolinkCount = await getRepository(User)
    .createQueryBuilder('user')
    .where({ id: user.id })
    .leftJoinAndSelect(Biolink, 'biolink', 'biolink.userId = user.id')
    .getCount()
  const plan = await Plan.findOne({ where: { id: user.planId } })

  if (!plan) {
    return {
      errors: [
        {
          field: 'username',
          message: 'Plan not defined',
        },
      ],
    }
  }

  if (
    plan.settings.totalBiolinksLimit !== -1 &&
    currentBiolinkCount >= plan.settings.totalBiolinksLimit
  ) {
    return {
      errors: [
        {
          field: 'username',
          message: 'Current plan does not support creating another biolink.',
        },
      ],
    }
  }

  // Creates biolink
  const category = await Category.findOne({ where: { id: options.categoryId } })

  const biolink = await Biolink.create({
    username: options.username,
    category,
    user: user,
  }).save()

  return { biolink }
}

export const getBiolinkFromUsername = async (username: string): Promise<BiolinkResponse> => {
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

  return { biolink }
}

export const updateBiolinkFromUsername = async (
  user: User,
  username: string,
  options: UpdateBiolinkProfileInput
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

  return { biolink }
}

export const updateBiolinkSettingsFromUsername = async (
  user: User,
  username: string,
  options: UpdateBiolinkSettingsInput
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

  return { biolink }
}

export const removeBiolinkByUsername = async (
  username: string,
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

  return {
    executed: true,
  }
}
