import { UsernameResponse } from '../../object-types'
import { Username, User, AdminRole } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { NewUsernameInput } from '../../input-types'

export const addUsername = async (
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

  const adminRole = (await adminUser.adminRole) as AdminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'username'
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

  try {
    const username = Username.create({
      premiumType: options.premiumType,
      username: options.username,
    })

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
    }

    await username.save()

    await captureUserActivity(adminUser, context, `Created username ${username.id}`, true)

    return { username }
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
