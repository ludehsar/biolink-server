import argon2 from 'argon2'
import randToken from 'rand-token'
import { validate } from 'class-validator'
import { MailDataRequired } from '@sendgrid/mail'

import { ErrorCode, MyContext } from '../../types'
import { AdminRole, Biolink, BlackList, Category, Plan, Username, User } from '../../entities'
import { NewUserInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { BlacklistType, PremiumUsernameType } from '../../enums'
import { captureUserActivity } from '../../services'
import { sgMail } from '../../utilities'
import moment from 'moment'

export const addNewUser = async (
  options: NewUserInput,
  adminUser: User,
  context: MyContext
): Promise<DefaultResponse> => {
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

  if (!adminUser) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const adminRole = (await adminUser.adminRole) as AdminRole
  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'user'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canCreate) &&
    adminRole.roleName !== 'Administrator'
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  const otherUser = await User.findOne({ where: { email: options.email } })
  const blacklistedEmail = await BlackList.findOne({
    where: { blacklistType: BlacklistType.Email, keyword: options.email },
  })

  if (otherUser || blacklistedEmail) {
    return {
      errors: [
        {
          errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
          message: 'Email already exists or blacklisted',
        },
      ],
    }
  }

  const availableUsername = await Username.findOne({ where: { username: options.username } })
  const otherBiolink = availableUsername?.biolink
  const premiumUsername = await Username.findOne({
    where: [
      {
        username: options.username,
        premiumType: PremiumUsernameType.Premium,
      },
      {
        username: options.username,
        premiumType: PremiumUsernameType.Trademark,
      },
    ],
  })
  const blacklistedBiolink = await BlackList.findOne({
    where: { blacklistType: BlacklistType.Username, keyword: options.username },
  })

  if (
    otherBiolink ||
    (availableUsername && moment(moment.now()).isBefore(availableUsername.expireDate)) ||
    blacklistedBiolink ||
    (premiumUsername && premiumUsername.owner !== null)
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
          message: 'Username already exists or blacklisted',
        },
      ],
    }
  }

  try {
    const password = randToken.generate(18)
    const encryptedPassword = await argon2.hash(password)

    const user = User.create({
      email: options.email,
      emailVerifiedAt: moment().toISOString(),
      encryptedPassword,
    })

    let username = await Username.findOne({ where: { username: options.username } })

    if (!username) {
      username = await Username.create({
        username: options.username,
      }).save()
    }

    const biolink = Biolink.create()
    biolink.username = Promise.resolve(username)

    if (options.adminRoleId) {
      const adminRole = await AdminRole.findOne(options.adminRoleId)

      if (adminRole) {
        user.adminRole = Promise.resolve(adminRole)
      }
    }

    if (options.categoryId) {
      const category = await Category.findOne(options.categoryId)

      if (category) {
        biolink.category = Promise.resolve(category)
      }
    }

    if (options.displayName) {
      biolink.displayName = options.displayName
    }

    if (options.planId) {
      const plan = await Plan.findOne(options.planId)

      if (!plan) {
        return {
          errors: [
            {
              errorCode: ErrorCode.PLAN_COULD_NOT_BE_FOUND,
              message: 'Plan not found',
            },
          ],
        }
      }

      user.plan = Promise.resolve(plan)
    }

    await user.save()

    biolink.user = Promise.resolve(user)
    await biolink.save()

    username.biolink = Promise.resolve(biolink)
    username.owner = Promise.resolve(user)
    username.expireDate = null
    await username.save()

    const newAccountConfirmationEmail: MailDataRequired = {
      to: user.email,
      from: {
        name: 'Stashee Support',
        email: 'info@stash.ee',
      },
      subject: `Login into your account to grab the username: ${biolink.username}`,
      text: `An account has been created with email: ${user.email} and password: ${password}. Please login to grab your username`,
      html: `An account has been created with email: ${user.email} and password: ${password}. Please login to grab your username`,
    }

    await sgMail.send(newAccountConfirmationEmail)

    await captureUserActivity(
      adminUser,
      context,
      `Created user ${user.email} with username ${biolink.username}`,
      true
    )

    return {}
  } catch (err) {
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
