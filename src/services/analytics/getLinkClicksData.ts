import { getRepository } from 'typeorm'
import { ErrorCode, MyContext } from '../../types'
import { TrackLink, User } from '../../entities'
import { LinkClicksResponse, SingleLinkClickCount } from '../../object-types'
import { captureUserActivity } from '../../services'

export const getLinkClicksData = async (
  user: User,
  context: MyContext
): Promise<LinkClicksResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
    }
  }

  const links = await user.links

  const result: SingleLinkClickCount[] = await Promise.all(
    links.map(
      async (link): Promise<SingleLinkClickCount> => ({
        link,
        allTimeVisited: await getRepository(TrackLink)
          .createQueryBuilder('tl')
          .where('tl.linkId = :linkId', { linkId: link.id })
          .getCount(),
        todayVisited: await getRepository(TrackLink)
          .createQueryBuilder('tl')
          .where('tl.linkId = :linkId', { linkId: link.id })
          .andWhere('"tl"."createdAt"::date = current_date')
          .getCount(),
      })
    )
  )

  await captureUserActivity(user, context, `Requested link clicks data`, false)

  return {
    result,
  }
}
