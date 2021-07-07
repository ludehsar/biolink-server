import { ErrorCode, MyContext } from '../../types'
import { User, Verification } from '../../entities'
import { VerificationResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { VerificationStatusInput } from '../../input-types'

export const changeVerificationStatus = async (
  id: string,
  options: VerificationStatusInput,
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

  verification.verificationStatus = options.status
  verification.verifiedEmail = options.verifiedEmail
  verification.verifiedGovernmentId = options.verifiedGovernmentId
  verification.verifiedPhoneNumber = options.verifiedPhoneNumber
  verification.verifiedWorkEmail = options.verifiedWorkEmail

  const biolink = await verification.biolink

  biolink.verificationStatus = options.status
  biolink.verifiedEmail = options.verifiedEmail
  biolink.verifiedGovernmentId = options.verifiedGovernmentId
  biolink.verifiedPhoneNumber = options.verifiedPhoneNumber
  biolink.verifiedWorkEmail = options.verifiedWorkEmail

  await verification.save()
  await biolink.save()

  await captureUserActivity(
    adminUser,
    context,
    `Changed verification status of biolink: ${biolink.username}`,
    true
  )

  return { verification }
}
