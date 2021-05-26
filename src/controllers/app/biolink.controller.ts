import { createWriteStream } from 'fs'
import { FileUpload } from 'graphql-upload'
import { validate } from 'class-validator'
import { Brackets, getRepository } from 'typeorm'
import moment from 'moment'
import * as argon2 from 'argon2'
import randToken from 'rand-token'
import path from 'path'

import { User } from '../../models/entities/User'
import { Biolink } from '../../models/entities/Biolink'
import { Category } from '../../models/entities/Category'
import { PremiumUsername } from '../../models/entities/PremiumUsername'
import { BlackList } from '../../models/entities/BlackList'
import { BlacklistType } from '../../models/enums/BlacklistType'
import { BooleanResponse, ErrorResponse } from '../../typeDefs/common.typeDef'
import { trackBiolink } from './analytics.controller'
import { MyContext } from '../../MyContext'
import { captureUserActivity } from './logs.controller'
import { ConnectionArgs } from '../../typeDefs/relaySpec.typeDef'
import {
  NewBiolinkInput,
  BiolinkResponse,
  UpdateBiolinkProfileInput,
  BiolinkConnection,
  ContactButtonInput,
  DarkModeInput,
  SocialAccountsInput,
  IntegrationInput,
  UTMParameterInput,
  SEOInput,
  BrandingInput,
  PrivacyInput,
  DirectoryInput,
  SortedLinksInput,
  BiolinkListResponse,
} from '../../typeDefs/biolink.typeDef'
import { ErrorCode } from '../../constants/errorCodes'
import { Link } from '../../models/entities/Link'
import { linktreeImportHandler } from '../../utils/importFromLinktree'
import { createNewLink } from './link.controller'

export const newBiolinkValidation = async (
  biolinkOptions: NewBiolinkInput
): Promise<BooleanResponse> => {
  // Checks input validatation
  const validationErrors = await validate(biolinkOptions)

  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        field: err.property,
        message: 'Not correctly formatted',
      })),
      executed: false,
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
          errorCode: ErrorCode.USERNAME_BLACKLISTED,
          field: 'username',
          message: 'Cannot create account with this username.',
        },
      ],
      executed: false,
    }
  }

  // Checks if username already exists
  const biolink = await Biolink.findOne({ where: { username: biolinkOptions.username } })
  if (biolink) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
          field: 'username',
          message: 'Username has already been taken.',
        },
      ],
      executed: false,
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
          errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
          field: 'username',
          message: 'Username has already been taken.',
        },
      ],
      executed: false,
    }
  }

  return {
    executed: true,
  }
}

export const createNewBiolink = async (
  options: NewBiolinkInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  const biolinkInputValidationReport = await newBiolinkValidation(options)
  if (!biolinkInputValidationReport.executed) {
    return { errors: biolinkInputValidationReport.errors }
  }

  // Checks authorization
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
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

  const biolink = Biolink.create({
    username: options.username,
  })

  biolink.user = Promise.resolve(user)

  await biolink.save()

  // Capture user log
  await captureUserActivity(user, context, `Created new biolink ${biolink.username}`)

  return { biolink }
}

export const getAllUserBiolinks = async (user: User): Promise<BiolinkListResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
    }
  }

  const biolinks = await Biolink.find({ where: { user } })

  return { biolinks }
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
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
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
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'Biolink not found',
        },
      ],
    }
  }

  if (biolink.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  biolink.displayName = options.displayName || ''
  biolink.location = options.location || ''
  biolink.bio = options.bio || ''

  if (options.categoryId) {
    const category = await Category.findOne(options.categoryId)

    if (!category) {
      return {
        errors: [
          {
            errorCode: ErrorCode.CATEGORY_COULD_NOT_BE_FOUND,
            message: 'Invalid category',
          },
        ],
      }
    }

    biolink.category = Promise.resolve(category)
  } else {
    biolink.category = undefined
  }

  await biolink.save()

  await captureUserActivity(user, context, `Updated ${biolink.username} biolink details`)

  return { biolink }
}

export const uploadBiolinkProfilePhoto = async (
  username: string,
  profilePhoto: FileUpload,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
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

  const { createReadStream, filename } = profilePhoto

  const profilePhotoExt = filename.split('.').pop()

  const errors: ErrorResponse[] = []

  const profilePhotoUrl = `${randToken.generate(20)}-${Date.now().toString()}.${profilePhotoExt}`

  const directory = path.join(__dirname, `../../../assets/profilePhotos/${profilePhotoUrl}`)

  createReadStream()
    .pipe(createWriteStream(directory))
    .on('error', () => {
      errors.push({
        errorCode: ErrorCode.UPLOAD_ERROR,
        message: 'Unable to upload profile photo',
      })
    })

  if (errors.length > 0) {
    return {
      errors,
    }
  }

  biolink.profilePhotoUrl = profilePhotoUrl
  await biolink.save()

  await captureUserActivity(user, context, `Uploaded ${biolink.username} profile photo`)

  return { biolink }
}

export const uploadBiolinkCoverPhoto = async (
  username: string,
  coverPhoto: FileUpload,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
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

  const { createReadStream, filename } = coverPhoto

  const coverPhotoExt = filename.split('.').pop()

  const errors: ErrorResponse[] = []

  const coverPhotoUrl = `${randToken.generate(20)}-${Date.now().toString()}.${coverPhotoExt}`

  const directory = path.join(__dirname, `../../../assets/coverPhotos/${coverPhotoUrl}`)

  createReadStream()
    .pipe(createWriteStream(directory))
    .on('error', () => {
      errors.push({
        errorCode: ErrorCode.UPLOAD_ERROR,
        message: 'Unable to upload profile photo',
      })
    })

  if (errors.length > 0) {
    return {
      errors,
    }
  }

  biolink.coverPhotoUrl = coverPhotoUrl
  await biolink.save()

  await captureUserActivity(user, context, `Uploaded ${biolink.username} cover photo`)

  return { biolink }
}

export const updateDarkModeOptions = async (
  username: string,
  options: DarkModeInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  const biolinkSettings = biolink.settings || {}

  // TODO: change according to plan
  biolinkSettings.enableDarkMode = options.enableDarkMode || false

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated dark mode settings of biolink: ${biolink.username}`
  )

  return { biolink }
}

export const updateContactButtonSettings = async (
  username: string,
  options: ContactButtonInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  const biolinkSettings = biolink.settings || {}

  // TODO: change according to plan
  biolinkSettings.enableColoredContactButtons = options.enableColoredContactButtons || false
  biolinkSettings.showEmail = options.showEmail || false
  biolinkSettings.showPhone = options.showPhone || false
  biolinkSettings.email = options.email || ''
  biolinkSettings.phone = options.phone || ''

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated contact button settings of biolink: ${biolink.username}`
  )

  return { biolink }
}

export const updateSocialAccountsSettings = async (
  username: string,
  options: SocialAccountsInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  const biolinkSettings = biolink.settings || {}

  // TODO: change according to plan
  biolinkSettings.enableColoredSocialMediaIcons = options.enableColoredSocialMediaIcons || false
  biolinkSettings.socialAccounts =
    options.socialAccounts?.map((option) => ({
      link: option.link || '#',
      platform: option.platform || 'Unknown',
    })) || []

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated social buttons settings of biolink: ${biolink.username}`
  )

  return { biolink }
}

export const updateIntegrationSettings = async (
  username: string,
  options: IntegrationInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  const biolinkSettings = biolink.settings || {}

  // TODO: change according to plan
  biolinkSettings.enableFacebookPixel = options.enableFacebookPixel || false
  biolinkSettings.enableGoogleAnalytics = options.enableGoogleAnalytics || false
  biolinkSettings.facebookPixelId = options.facebookPixelId || ''
  biolinkSettings.googleAnalyticsCode = options.googleAnalyticsCode || ''

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated integration settings of biolink: ${biolink.username}`
  )

  return { biolink }
}

export const updateUTMParameterSettings = async (
  username: string,
  options: UTMParameterInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  const biolinkSettings = biolink.settings || {}

  // TODO: change according to plan
  biolinkSettings.enableUtmParameters = options.enableUtmParameters || false
  biolinkSettings.utmCampaign = options.utmCampaign || ''
  biolinkSettings.utmMedium = options.utmMedium || ''
  biolinkSettings.utmSource = options.utmSource || ''

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated utm parameter settings of biolink: ${biolink.username}`
  )

  return { biolink }
}

export const updateSEOSettings = async (
  username: string,
  options: SEOInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  const biolinkSettings = biolink.settings || {}

  // TODO: change according to plan
  biolinkSettings.blockSearchEngineIndexing = options.blockSearchEngineIndexing || false
  biolinkSettings.pageTitle = options.pageTitle || ''
  biolinkSettings.metaDescription = options.metaDescription || ''
  biolinkSettings.opengraphImageUrl = options.opengraphImageUrl || '' // TODO: Image upload

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(user, context, `Updated seo settings of biolink: ${biolink.username}`)

  return { biolink }
}

export const updateBrandingSettings = async (
  username: string,
  options: BrandingInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  const biolinkSettings = biolink.settings || {}

  // TODO: change according to plan
  biolinkSettings.removeDefaultBranding = options.removeDefaultBranding || false
  biolinkSettings.enableCustomBranding = options.enableCustomBranding || false
  biolinkSettings.customBrandingName = options.customBrandingName || ''
  biolinkSettings.customBrandingUrl = options.customBrandingUrl || ''

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(user, context, `Updated brand settings of biolink: ${biolink.username}`)

  return { biolink }
}

export const updatePrivacySettings = async (
  username: string,
  options: PrivacyInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  const biolinkSettings = biolink.settings || {}

  // TODO: change according to plan
  biolinkSettings.enablePasswordProtection = options.enablePasswordProtection || false
  biolinkSettings.enableSensitiveContentWarning = options.enableSensitiveContentWarning || false
  biolinkSettings.password = await argon2.hash(options.password || '')

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated privacy settings of biolink: ${biolink.username}`
  )

  return { biolink }
}

export const updateDirectorySettings = async (
  username: string,
  options: DirectoryInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  const biolinkSettings = biolink.settings || {}

  // TODO: change according to plan
  biolinkSettings.addedToDirectory = options.addedToDirectory || false
  biolinkSettings.directoryBio = options.directoryBio || ''

  biolink.settings = biolinkSettings
  await biolink.save()

  await captureUserActivity(
    user,
    context,
    `Updated directory settings of biolink: ${biolink.username}`
  )

  return { biolink }
}

export const sortBiolinkLinks = async (
  username: string,
  options: SortedLinksInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  const errors: ErrorResponse[] = []

  options.shortenedLinks?.map(async (shortendLink, id) => {
    const link = await Link.findOne({
      where: {
        shortenedUrl: shortendLink,
      },
    })

    if (!link) {
      errors.push({
        errorCode: ErrorCode.LINK_COULD_NOT_BE_FOUND,
        message: 'Link with this shortened url could not be found',
      })
    }

    if (!user || link?.userId !== user.id) {
      errors.push({
        errorCode: ErrorCode.USER_NOT_AUTHORIZED,
        message: 'The user is not authorized',
      })
    }

    if (link?.biolinkId !== biolink.id) {
      errors.push({
        errorCode: ErrorCode.DATABASE_ERROR,
        message: 'The link is not of this biolink',
      })
    }

    if (errors.length <= 0) {
      ;(link as Link).order = id
      await (link as Link).save()
    }
  })

  await captureUserActivity(user, context, `Sorted links of biolink: ${biolink.username}`)

  return { biolink }
}

export const getAllDirectories = async (
  categoryId: number,
  options: ConnectionArgs
): Promise<BiolinkConnection> => {
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
          .orWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
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

  qb.leftJoinAndSelect('biolink.user', 'user')

  if (before) {
    qb.andWhere('biolink.createdAt < :before', { before })
      .orderBy('biolink.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('biolink.createdAt > :after', { after })
      .orderBy('biolink.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('biolink.createdAt', 'ASC').limit(options.first)
  }

  const biolinks = await qb.getMany()

  if (before) {
    biolinks.reverse()
  }

  const firstBiolink = biolinks[0]
  const lastBiolink = biolinks[biolinks.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstBiolink?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastBiolink?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

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
          .orWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
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
          .orWhere(`LOWER(biolink.settings->>'directoryBio') like :query`, {
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
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
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
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
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
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
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

export const importFromLinktree = async (
  username: string,
  linktreeUsername: string,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
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

  const biolink = await Biolink.findOne({ where: { username } })

  if (!biolink || biolink.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  const url = `https://linktr.ee/${linktreeUsername}`

  try {
    const res = await linktreeImportHandler(url)

    if (res.bio) biolink.bio = res.bio

    if (res.links) {
      res.links.forEach(async (link) => {
        await createNewLink(
          { url: link.url, linkTitle: link.linkTitle, enablePasswordProtection: false },
          user,
          context,
          username
        )
      })
    }

    if (res.profilePhotoUrl) biolink.profilePhotoUrl = res.profilePhotoUrl

    if (res.socials) {
      const biolinkSettings = biolink.settings || {}

      biolinkSettings.socialAccounts = res.socials

      biolink.settings = biolinkSettings
    }

    await biolink.save()

    return { biolink }
  } catch (err) {
    return {
      errors: [
        {
          errorCode: ErrorCode.INVALID_TOKEN,
          message: err.message,
        },
      ],
    }
  }
}
