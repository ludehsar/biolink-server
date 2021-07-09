import { UsernameResponse } from '../../object-types'
import { Username, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { NewUsernameInput } from '../../input-types'

export const editUsername = async (
  usernameId: string,
  options: NewUsernameInput,
  adminUser: User,
  context: MyContext
): Promise<UsernameResponse> => {
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

  const username = await Username.findOne(usernameId)

  if (!username) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USERNAME_NOT_FOUND,
          message: 'Username not found',
        },
      ],
    }
  }

  const adminRole = await adminUser.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'username'
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

  try {
    if (options.premiumType) username.premiumType = options.premiumType
    if (options.username) username.username = options.username

    if (options.ownerId) {
      const user = await User.findOne(options.ownerId)

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

      username.owner = Promise.resolve(user)
    } else {
      username.owner = null
    }

    await username.save()

    await captureUserActivity(adminUser, context, `Edited username ${username.id}`, true)

    return { username }
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
