import { ConnectionArgsOld } from 'input-types'
import moment from 'moment'
import { Brackets, getRepository } from 'typeorm'
import { Referral, User } from '../../entities'
import { ReferralConnection } from '../../object-types'
import { ErrorCode } from '../../types'

export const getSentEmailReferralsPaginated = async (
  options: ConnectionArgsOld,
  user: User
): Promise<ReferralConnection> => {
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

  // Getting before and after cursors from connection args
  let before = null
  if (options.before) before = Buffer.from(options.before, 'base64').toString()

  let after = null
  if (options.after)
    after = moment(Buffer.from(options.after, 'base64').toString())
      .add(1, 'second')
      .format('YYYY-MM-DD HH:mm:ss')

  // Gettings the directories and preparing objects
  const connection = new ReferralConnection()

  const qb = getRepository(Referral)
    .createQueryBuilder('referral')
    .where(`referral.referredById = :userId`, { userId: user.id })
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(referral.referredByEmail) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(referral.referredByName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(referral.referredToEmail) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(referral.referredToName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (before) {
    qb.andWhere('referral.createdAt < :before', { before })
      .orderBy('referral.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('referral.createdAt > :after', { after })
      .orderBy('referral.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('referral.createdAt', 'ASC').limit(options.first)
  }

  const referrals = await qb.getMany()

  if (before) {
    referrals.reverse()
  }

  const firstReferral = referrals[0]
  const lastReferral = referrals[referrals.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstReferral?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastReferral?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = referrals.map((referral) => ({
    node: referral,
    cursor: Buffer.from(moment(referral.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString(
      'base64'
    ),
  }))

  const previousReferrals = await getRepository(Referral)
    .createQueryBuilder('referral')
    .where(`referral.referredById = :userId`, { userId: user.id })
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(referral.referredByEmail) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(referral.referredByName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(referral.referredToEmail) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(referral.referredToName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('referral.createdAt < :minDate', { minDate })
    .getMany()

  const nextReferrals = await getRepository(Referral)
    .createQueryBuilder('referral')
    .where(`referral.referredById = :userId`, { userId: user.id })
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(referral.referredByEmail) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(referral.referredByName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(referral.referredToEmail) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(referral.referredToName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('referral.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstReferral?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastReferral?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextReferrals.length,
    hasPreviousPage: !!previousReferrals.length,
  }

  return connection
}
