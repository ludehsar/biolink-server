import { validate } from 'class-validator'
import { DefaultResponse } from '../../object-types'
import { Support, User } from '../../entities'
import { NewSupportInput } from '../../input-types'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const addSupport = async (
  options: NewSupportInput,
  user: User,
  context: MyContext
): Promise<DefaultResponse> => {
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

  const support = Support.create({
    description: options.description,
    email: options.email,
    firstName: options.firstName,
    lastName: options.lastName,
  })

  if (user) {
    support.user = Promise.resolve(user)
  }

  await support.save()

  if (user) {
    await captureUserActivity(user, context, `Added support`)
  }

  return {}
}
