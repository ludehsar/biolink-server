import { getRepository } from 'typeorm'
import { ErrorCode, MyContext } from '../../types'
import { Biolink, TrackLink, User } from '../../entities'
import { BiolinkClicksResponse, SingleBiolinkClickCount } from '../../object-types'
import { captureUserActivity } from '../../services'

export const getBiolinkClicksData = async (
  biolinkId: string,
  user: User,
  context: MyContext
): Promise<BiolinkClicksResponse> => {
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

  const biolink = await Biolink.findOne(biolinkId)

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

  const result: SingleBiolinkClickCount = {
    biolink,
    allTimeVisited: await getRepository(TrackLink)
      .createQueryBuilder('tb')
      .where('tb.biolinkId = :biolinkId', { biolinkId: biolink.id })
      .getCount(),
    todayVisited: await getRepository(TrackLink)
      .createQueryBuilder('tb')
      .where('tb.biolinkId = :biolinkId', { biolinkId: biolink.id })
      .andWhere('"tb"."createdAt"::date = current_date')
      .getCount(),
  }

  await captureUserActivity(user, context, `Requested biolink clicks data`, false)

  return {
    result,
  }
}
