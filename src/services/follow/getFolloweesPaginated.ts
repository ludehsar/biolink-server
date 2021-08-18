import { getRepository } from 'typeorm'
import moment from 'moment'
import { Biolink, User } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { BiolinkConnection } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { captureUserActivity } from '../../services'

export const getFolloweesPaginated = async (
  options: ConnectionArgs,
  user: User,
  context: MyContext
): Promise<BiolinkConnection> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'Biolink not authenticated',
        },
      ],
    }
  }
  // Getting before and after cursors from connection args
  let before = null
  if (options.before) before = Buffer.from(options.before, 'base64').toString()

  let after = null
  if (options.after)
    after = moment(Buffer.from(options.after, 'base64').toString())
      .add(1, 'second')
      .format('YYYY-MM-DD HH:mm:ss')

  // Gettings the directories and preparing objects
  const connection = new BiolinkConnection()

  const qb = getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.followees', 'follow')
    .where('follow.followerId = :userId', { userId: user.id })

  if (before) {
    qb.andWhere('biolink.createdAt < :before', { before })
      .orderBy('biolink.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('biolink.createdAt > :after', { after })
      .orderBy('biolink.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('biolink.createdAt', 'ASC').limit(options.first)
  }

  const biolinks = await qb.getMany()

  if (before) {
    biolinks.reverse()
  }

  const firstBiolink = biolinks[0]
  const lastBiolink = biolinks[biolinks.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstBiolink?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastBiolink?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = biolinks.map((biolink) => ({
    node: biolink,
    cursor: Buffer.from(moment(biolink.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString('base64'),
  }))

  const previousBiolinks = await getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.followees', 'follow')
    .where('follow.followerId = :userId', { userId: user.id })
    .andWhere('biolink.createdAt < :minDate', { minDate })
    .getMany()

  const nextBiolinks = await getRepository(Biolink)
    .createQueryBuilder('biolink')
    .leftJoinAndSelect('biolink.followees', 'follow')
    .where('follow.followerId = :userId', { userId: user.id })
    .andWhere('biolink.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstBiolink?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastBiolink?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextBiolinks.length,
    hasPreviousPage: !!previousBiolinks.length,
  }

  await captureUserActivity(user, context, 'Requested followees', false)

  return connection
}
