import { validate } from 'class-validator'
import { CategoryResponse } from '../../object-types'
import { NewCategoryInput } from '../../input-types'
import { ErrorCode, MyContext } from '../../types'
import { Category, User } from '../../entities'
import { captureUserActivity } from '../../services'

export const addCategory = async (
  options: NewCategoryInput,
  adminUser: User,
  context: MyContext
): Promise<CategoryResponse> => {
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
  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'category'
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
    const category = await Category.create({
      categoryName: options.categoryName,
    }).save()

    await captureUserActivity(adminUser, context, `Created category ${category.categoryName}`)

    return { category }
  } catch (err) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CATEGORY_ALREADY_EXISTS,
          message: err.message,
        },
      ],
    }
  }
}
