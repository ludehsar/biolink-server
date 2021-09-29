import { VerificationResponse } from '../../object-types'
import { Verification, User, AdminRole } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const getVerification = async (
  verificationId: string,
  adminUser: User,
  context: MyContext
): Promise<VerificationResponse> => {
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

  const verification = await Verification.findOne(verificationId)

  if (!verification) {
    return {
      errors: [
        {
          errorCode: ErrorCode.VERIFICATION_NOT_FOUND,
          message: 'Verification not found',
        },
      ],
    }
  }

  const adminRole = (await adminUser.adminRole) as AdminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'verification'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canShow) &&
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

  await captureUserActivity(adminUser, context, `Requested verification ${verification.id}`, false)

  return { verification }
}
