import { LinkSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { LinkSystemSettings } from '../../json-types'

export const getLinkSettings = async (
  adminUser: User,
  context: MyContext
): Promise<LinkSettingsResponse> => {
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

  if (!adminRole || adminRole.roleName !== 'Administrator') {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  let link = await Settings.findOne({ where: { key: 'link' } })

  if (!link) {
    link = await Settings.create({
      key: 'link',
    }).save()
  }

  const linkSettings = link.value as LinkSystemSettings

  await captureUserActivity(adminUser, context, `Requested link settings`, false)

  return { settings: linkSettings }
}
