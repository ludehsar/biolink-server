import { captureUserActivity } from '../../services'
import { AdminRole, Plan, User } from '../../entities'
import { PlanListResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'

export const getAllPlans = async (
  adminUser: User,
  context: MyContext
): Promise<PlanListResponse> => {
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
    return role.resource === 'plan'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canShowList) &&
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

  const plans = await Plan.find()

  if (!plans) {
    return {
      errors: [
        {
          errorCode: ErrorCode.DATABASE_ERROR,
          message: 'Something went wrong',
        },
      ],
    }
  }

  await captureUserActivity(adminUser, context, `Requested all plans`, false)

  return {
    plans,
  }
}
