import moment from 'moment'
import { getRepository } from 'typeorm'
import { captureUserActivity } from '../../services'
import { User, Biolink, Link } from '../../entities'
import { LinkListResponse } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'

export const getAllLinksOfBiolink = async (
  biolinkId: string,
  showOnPage: boolean,
  currentUser: User,
  context: MyContext
): Promise<LinkListResponse> => {
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

  const qb = getRepository(Link).createQueryBuilder('link').where({
    biolink,
  })

  if (showOnPage) {
    qb.andWhere(
      `(link.startDate IS NULL AND link.endDate IS NULL) OR (link.startDate <= :currentDate AND link.endDate >= :currentDate)`,
      {
        currentDate: moment().toISOString(),
      }
    )
  } else {
    if (!currentUser || biolink.userId !== currentUser.id) {
      return {
        errors: [
          {
            errorCode: ErrorCode.USER_NOT_AUTHORIZED,
            message: 'User is not authorized',
          },
        ],
      }
    }
  }

  qb.orderBy('link.order', 'ASC')

  const links = await qb.getMany()

  if (currentUser) await captureUserActivity(currentUser, context, `Requested biolink links`, false)

  return { links }
}
