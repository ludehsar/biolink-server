import { NotificationSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { NotificationSystemSettings } from '../../json-types'

export const getNotificationSettings = async (
  adminUser: User,
  context: MyContext
): Promise<NotificationSettingsResponse> => {
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

  let notification = await Settings.findOne({ where: { key: 'notification' } })

  if (!notification) {
    notification = await Settings.create({
      key: 'notification',
    }).save()
  }

  const notificationSettings = notification.value as NotificationSystemSettings

  await captureUserActivity(adminUser, context, `Requested notification settings`, false)

  return { settings: notificationSettings }
}
