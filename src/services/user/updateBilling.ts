import { validate } from 'class-validator'
import { UserResponse } from 'object-types'

import { ErrorCode, MyContext } from '../../types'
import { BillingInput } from '../../input-types/user/BillingInput'
import { User } from '../../entities'
import { BillingType } from '../../enums'
import { captureUserActivity } from '../../services'

export const updateBilling = async (
  options: BillingInput,
  user: User,
  context: MyContext
): Promise<UserResponse> => {
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

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const billing = user.billing || {}

  billing.address1 = options.address1 || ''
  billing.address2 = options.address2 || ''
  billing.city = options.city || ''
  billing.country = options.country || ''
  billing.name = options.name || ''
  billing.phone = options.phone || ''
  billing.state = options.state || ''
  billing.type = options.type || BillingType.Personal
  billing.zip = options.zip || ''

  user.billing = billing

  await user.save()

  await captureUserActivity(user, context, 'Updated user billing')

  return {
    user,
  }
}
