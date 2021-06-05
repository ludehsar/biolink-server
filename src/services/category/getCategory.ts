import { CategoryResponse } from '../../object-types'
import { ErrorCode } from '../../types'
import { Category } from '../../entities'

export const getCategory = async (id: number): Promise<CategoryResponse> => {
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

  return {
    category,
  }
}
