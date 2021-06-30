import { validate } from 'class-validator'
import { CategoryResponse } from '../../object-types'
import { NewCategoryInput } from '../../input-types'
import { ErrorCode, MyContext } from '../../types'
import { Category, User } from '../../entities'
import { captureUserActivity } from '../../services'

export const editCategory = async (
  id: number,
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
    (!adminRole || !userSettings || !userSettings.canEdit) &&
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

  const category = await Category.findOne(id)

  if (!category) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CATEGORY_COULD_NOT_BE_FOUND,
          message: 'Category not found',
        },
      ],
    }
  }

  try {
    category.categoryName = options.categoryName as string
    await category.save()

    await captureUserActivity(
      adminUser,
      context,
      `Edited category to ${category.categoryName}`,
      true
    )

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
