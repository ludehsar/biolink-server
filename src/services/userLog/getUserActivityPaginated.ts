import moment from 'moment'
import { getRepository } from 'typeorm'

import { User, UserLogs } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { ActivityConnection } from '../../object-types'
import { MyContext, ErrorCode } from '../../types'
import { captureUserActivity } from '../../services'

export const getUserActivityPaginated = async (
  options: ConnectionArgs,
  user: User,
  context: MyContext
): Promise<ActivityConnection> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'Not authenticated',
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
  const connection = new ActivityConnection()

  const qb = getRepository(UserLogs)
    .createQueryBuilder('activity')
    .leftJoinAndSelect('activity.user', 'user')
    .where(`user.id = :userId`, {
      userId: user.id,
    })
    .andWhere(`activity.showInActivity = TRUE`)

  if (before) {
    qb.andWhere('activity.createdAt < :before', { before })
      .orderBy('activity.createdAt', 'DESC')
      .limit(options.last)
  } else if (after) {
    qb.andWhere('activity.createdAt > :after', { after })
      .orderBy('activity.createdAt', 'DESC')
      .limit(options.last)
  } else {
    qb.orderBy('activity.createdAt', 'DESC').limit(options.last)
  }

  const activities = await qb.getMany()

  activities.reverse()

  const firstActivity = activities[0]
  const lastActivity = activities[activities.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstActivity?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastActivity?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = activities.map((activity) => ({
    node: activity,
    cursor: Buffer.from(moment(activity.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString(
      'base64'
    ),
  }))

  const previousActivities = await getRepository(UserLogs)
    .createQueryBuilder('activity')
    .leftJoinAndSelect('activity.user', 'user')
    .where(`user.id = :userId`, {
      userId: user.id,
    })
    .andWhere(`activity.showInActivity = TRUE`)
    .andWhere('activity.createdAt < :minDate', { minDate })
    .getMany()

  const nextActivities = await getRepository(UserLogs)
    .createQueryBuilder('activity')
    .leftJoinAndSelect('activity.user', 'user')
    .where(`user.id = :userId`, {
      userId: user.id,
    })
    .andWhere(`activity.showInActivity = TRUE`)
    .andWhere('activity.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstActivity?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastActivity?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextActivities.length,
    hasPreviousPage: !!previousActivities.length,
  }

  await captureUserActivity(user, context, `Read activities`, false)

  return connection
}
