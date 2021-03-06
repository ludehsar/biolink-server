import { captureUserActivity } from '../../services'
import { AdminRole, Plan, User } from '../../entities'
import { PlanResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'

export const getPlan = async (
  id: number,
  adminUser: User,
  context: MyContext
): Promise<PlanResponse> => {
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

  const plan = await Plan.findOne(id)

  if (!plan) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PLAN_COULD_NOT_BE_FOUND,
          message: 'Plan not found',
        },
      ],
    }
  }

  await captureUserActivity(adminUser, context, `Requested ${plan.name} plan`, false)

  return {
    plan,
  }
}
