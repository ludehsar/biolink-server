import { User, Link } from 'entities'
import { LinkResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'

export const removeLink = async (
  shortenedUrl: string,
  user: User,
  context: MyContext
): Promise<LinkResponse> => {
  const link = await Link.findOne({ where: { shortenedUrl } })

  if (!link) {
    return {
      errors: [
        {
          errorCode: ErrorCode.LINK_COULD_NOT_BE_FOUND,
          message: 'No link found',
        },
      ],
    }
  }

  if (!user || user.id !== link.userId) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'Not authorized',
        },
      ],
    }
  }

  await link.softRemove()

  // Capture user log
  await captureUserActivity(user, context, `Link ${link.url} removed`)

  return { link }
}
