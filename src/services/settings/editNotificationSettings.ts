import { validate } from 'class-validator'
import { NotificationSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { NotificationSettingsInput } from '../../input-types'
import { NotificationSystemSettings } from '../../json-types'

export const editNotificationSettings = async (
  options: NotificationSettingsInput,
  adminUser: User,
  context: MyContext
): Promise<NotificationSettingsResponse> => {
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

  const notificationSettings = (notification.value || {}) as NotificationSystemSettings

  notificationSettings.emailOnNewPayment = options.emailOnNewPayment || false
  notificationSettings.emailOnNewUser = options.emailOnNewUser || false
  notificationSettings.emailsToBeNotified = options.emailsToBeNotified || []

  notification.value = notificationSettings
  await notification.save()

  await captureUserActivity(adminUser, context, `Changed notification settings`, true)

  return { settings: notificationSettings }
}
