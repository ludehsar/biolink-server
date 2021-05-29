import { User, Biolink, Link } from 'entities'
import { validate } from 'class-validator'
import { SortedLinksInput } from 'input-types'
import { BiolinkResponse, ErrorResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'

export const sortBiolinkLinks = async (
  id: string,
  options: SortedLinksInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  // Validate input
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

  if (!user || biolink.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  const errors: ErrorResponse[] = []

  options.shortenedLinks?.map(async (shortendLink, id) => {
    const link = await Link.findOne({
      where: {
        shortenedUrl: shortendLink,
      },
    })

    if (!link) {
      errors.push({
        errorCode: ErrorCode.LINK_COULD_NOT_BE_FOUND,
        message: 'Link with this shortened url could not be found',
      })
    }

    if (!user || link?.userId !== user.id) {
      errors.push({
        errorCode: ErrorCode.USER_NOT_AUTHORIZED,
        message: 'The user is not authorized',
      })
    }

    if (link?.biolinkId !== biolink.id) {
      errors.push({
        errorCode: ErrorCode.DATABASE_ERROR,
        message: 'The link is not of this biolink',
      })
    }

    if (errors.length <= 0) {
      ;(link as Link).order = id
      await (link as Link).save()
    }
  })

  await captureUserActivity(user, context, `Sorted links of biolink: ${biolink.username}`)

  return { biolink }
}
