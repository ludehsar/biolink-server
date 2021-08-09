import axios from 'axios'

import { POSITIONTRACK_API_KEY } from '../../config'
import { User, Biolink, Category } from '../../entities'
import { UpdateBiolinkProfileInput } from '../../input-types'
import { BiolinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

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
  biolink.city = options.city || ''
  biolink.country = options.country || ''
  biolink.state = options.state || ''
  biolink.bio = options.bio || ''

  try {
    const geoResponse = await axios.get(
      `http://api.positionstack.com/v1/forward?&access_key=${POSITIONTRACK_API_KEY}&query=${
        biolink.city + ', ' + biolink.state + ', ' + biolink.country
      }&limit=1&output=json`
    )

    const geoData = await geoResponse.data

    biolink.latitude = geoData.data[0].latitude || 0
    biolink.longitude = geoData.data[0].longitude || 0
  } catch (err) {
    console.error(err.message)
  }

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

  await captureUserActivity(user, context, `Updated ${biolink.username} biolink details`, true)

  return { biolink }
}
