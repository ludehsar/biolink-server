import { CodeResponse } from '../../object-types'
import { AdminRole, Code, User } from '../../entities'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'
import { NewCodeInput } from '../../input-types'
import { stripe } from '../../utilities'
import moment from 'moment'

export const addCode = async (
  options: NewCodeInput,
  adminUser: User,
  context: MyContext
): Promise<CodeResponse> => {
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
    return role.resource === 'code'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canCreate) &&
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

  try {
    const code = Code.create({
      code: options.code,
      discount: options.discount,
      expireDate: options.expireDate,
      quantity: options.quantity,
      type: options.type,
    })

    if (options.referrerId) {
      const user = await User.findOne(options.referrerId)

      if (!user) {
        return {
          errors: [
            {
              errorCode: ErrorCode.USER_NOT_FOUND,
              message: 'No user found with this id',
            },
          ],
        }
      }

      code.referrer = Promise.resolve(user)
    }

    await stripe.coupons.create({
      id: code.code,
      max_redemptions: code.quantity >= 0 ? code.quantity : undefined,
      percent_off: code.discount,
      duration: 'once',
      redeem_by: moment(code.expireDate).unix() || undefined,
    })

    await code.save()

    await captureUserActivity(adminUser, context, `Created code ${code.id}`, true)

    return { code }
  } catch (err) {
    return {
      errors: [
        {
          errorCode: ErrorCode.DATABASE_ERROR,
          message: 'Something went wrong',
        },
      ],
    }
  }
}
