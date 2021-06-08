import { validate } from 'class-validator'

import { ErrorCode, MyContext } from '../../types'
import { AdminRole, BlackList, Plan, User } from '../../entities'
import { EditUserInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { BlacklistType } from '../../enums'
import { captureUserActivity } from '../../services'
import moment from 'moment'

export const editUser = async (
  id: string,
  options: EditUserInput,
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

  const adminRole = await adminUser.adminRole
  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'user'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canEdit) &&
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

  const user = await User.findOne(id)

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'User not found',
        },
      ],
    }
  }

  const otherUser = await User.findOne({ where: { email: options.email } })
  const blacklistedEmail = await BlackList.findOne({
    where: { blacklistType: BlacklistType.Email, keyword: options.email },
  })

  if ((otherUser && otherUser.id !== user.id) || blacklistedEmail) {
    return {
      errors: [
        {
          errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
          message: 'Email already exists or blacklisted',
        },
      ],
    }
  }

  try {
    if (options.email) {
      user.email = options.email
      user.emailVerifiedAt = moment().toDate()
    }

    if (options.adminRoleId) {
      const adminRole = await AdminRole.findOne(options.adminRoleId)

      if (adminRole) {
        user.adminRole = Promise.resolve(adminRole)
      }
    }

    if (options.planId) {
      const plan = await Plan.findOne(options.planId)

      if (plan) {
        user.plan = Promise.resolve(plan)
      }
    }

    await user.save()

    await captureUserActivity(adminUser, context, `Edited user with email: ${user.email}`)

    return {}
  } catch (err) {
    return {
      errors: [
        {
          errorCode: ErrorCode.DATABASE_ERROR,
          message: err.message,
        },
      ],
    }
  }
}
