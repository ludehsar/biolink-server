import randToken from 'rand-token'
import path from 'path'
import { createWriteStream } from 'fs'
import { ErrorResponse, MainSettingsResponse } from '../../object-types'
import { Settings, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { MainSettingsInput } from '../../input-types'
import { MainSystemSettings } from '../../json-types'
import { BACKEND_URL } from '../../config'

export const editMainSettings = async (
  options: MainSettingsInput,
  adminUser: User,
  context: MyContext
): Promise<MainSettingsResponse> => {
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

  let main = await Settings.findOne({ where: { key: 'main' } })

  if (!main) {
    main = await Settings.create({
      key: 'main',
    }).save()
  }

  const mainSettings = main.value as MainSystemSettings

  mainSettings.defaultLanguage = options.defaultLanguage || ''
  mainSettings.defaultTimezone = options.defaultTimezone || ''
  mainSettings.enableEmailConfirmation = options.enableEmailConfirmation || false
  mainSettings.enableNewUserRegistration = options.enableNewUserRegistration || false
  mainSettings.privacyPolicyUrl = options.privacyPolicyUrl || ''
  mainSettings.termsAndConditionsUrl = options.termsAndConditionsUrl || ''
  mainSettings.title = options.title || ''

  const errors: ErrorResponse[] = []

  if (options.faviconLogo) {
    const { createReadStream, filename } = options.faviconLogo

    const faviconLogoExt = filename.split('.').pop()

    const faviconLogoName = `${randToken.generate(20)}-${Date.now().toString()}.${faviconLogoExt}`

    const faviconLogoDir = path.join(__dirname, `../../../assets/photoIds/${faviconLogoName}`)

    createReadStream()
      .pipe(createWriteStream(faviconLogoDir))
      .on('error', () => {
        errors.push({
          errorCode: ErrorCode.UPLOAD_ERROR,
          message: 'Unable to upload PhotoId',
        })
      })

    mainSettings.faviconLogoUrl = BACKEND_URL + '/static/logos/' + faviconLogoName
  }

  if (options.websiteLogo) {
    const { createReadStream, filename } = options.websiteLogo

    const websiteLogoExt = filename.split('.').pop()

    const websiteLogoName = `${randToken.generate(20)}-${Date.now().toString()}.${websiteLogoExt}`

    const websiteLogoDir = path.join(__dirname, `../../../assets/photoIds/${websiteLogoName}`)

    createReadStream()
      .pipe(createWriteStream(websiteLogoDir))
      .on('error', () => {
        errors.push({
          errorCode: ErrorCode.UPLOAD_ERROR,
          message: 'Unable to upload PhotoId',
        })
      })

    mainSettings.websiteLogoUrl = BACKEND_URL + '/static/logos/' + websiteLogoName
  }

  main.value = mainSettings
  await main.save()

  await captureUserActivity(adminUser, context, `Changed main settings`, false)

  return { settings: mainSettings }
}
