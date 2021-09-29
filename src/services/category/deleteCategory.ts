import { DefaultResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { AdminRole, Category, User } from '../../entities'
import { captureUserActivity } from '../../services'

export const deleteCategory = async (
  id: number,
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

  const adminRole = (await adminUser.adminRole) as AdminRole
  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'category'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canDelete) &&
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

  await category.remove()
  await captureUserActivity(adminUser, context, `Deleted category ${id}`, false)

  return {}
}
