import { User, Biolink, Category } from 'entities'
import { UpdateBiolinkProfileInput } from 'input-types'
import { BiolinkResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'

export const updateBiolink = async (
  user: User,
  id: string,
  options: UpdateBiolinkProfileInput,
  context: MyContext
): Promise<BiolinkResponse> => {
  const biolink = await Biolink.findOne(id)

  if (!biolink) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'Biolink not found',
        },
      ],
    }
  }

  if (biolink.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  biolink.displayName = options.displayName || ''
  biolink.location = options.location || ''
  biolink.bio = options.bio || ''

  if (options.categoryId) {
    const category = await Category.findOne(options.categoryId)

    if (!category) {
      return {
        errors: [
          {
            errorCode: ErrorCode.CATEGORY_COULD_NOT_BE_FOUND,
            message: 'Invalid category',
          },
        ],
      }
    }

    biolink.category = Promise.resolve(category)
  } else {
    biolink.category = undefined
  }

  await biolink.save()

  await captureUserActivity(user, context, `Updated ${biolink.username} biolink details`)

  return { biolink }
}
