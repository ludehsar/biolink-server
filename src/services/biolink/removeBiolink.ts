import { User, Biolink } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const removeBiolink = async (
  id: string,
  context: MyContext,
  user: User
): Promise<DefaultResponse> => {
  const biolink = await Biolink.findOne(id)

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

  if (!biolink) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'No biolink found with this username',
        },
      ],
    }
  }

  const adminRole = await user.adminRole
  let userSettings = null

  if (adminRole) {
    const adminRoleSettings = adminRole?.roleSettings || []

    userSettings = adminRoleSettings.find((role): boolean => {
      return role.resource === 'biolink'
    })
  }

  if (
    biolink.userId !== user.id &&
    (!adminRole || !userSettings || !userSettings.canDelete) &&
    (!adminRole || adminRole.roleName !== 'Administrator')
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  const biolinkUsername = await biolink.username

  biolink.username = null
  await biolink.save()

  if (biolinkUsername) {
    biolinkUsername.biolink = null
    biolinkUsername.expireDate = new Date(Date.now() + 12096e5)
    await biolinkUsername.save()
  }

  await biolink.softRemove()

  await captureUserActivity(user, context, `Removed biolink ${biolink.username}`, true)

  return {}
}
