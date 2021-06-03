import { ErrorCode, MyContext } from '../../types'
import { User, Verification } from '../../entities'
import { VerificationStatus } from '../../enums'
import { DefaultResponse } from '../../object-types'
import { captureUserActivity } from '../../services'

export const changeVerificationStatus = async (
  id: string,
  status: VerificationStatus,
  adminUser: User,
  context: MyContext
): Promise<DefaultResponse> => {
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
    return role.resource === 'verification'
  })

  if (!adminRole || !userSettings || !userSettings.canEdit) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  const verification = await Verification.findOne(id)

  if (!verification) {
    return {
      errors: [
        {
          errorCode: ErrorCode.VERIFICATION_NOT_FOUND,
          message: 'Verification with this id not found',
        },
      ],
    }
  }

  verification.verificationStatus = status
  const biolink = await verification.biolink

  biolink.verificationStatus = status

  await verification.save()
  await biolink.save()

  await captureUserActivity(
    adminUser,
    context,
    `Changed verification status of biolink: ${biolink.username}`
  )

  return {}
}
