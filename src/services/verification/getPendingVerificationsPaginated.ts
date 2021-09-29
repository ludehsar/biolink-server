import { getRepository, Brackets } from 'typeorm'
import moment from 'moment'
import { Verification, User, AdminRole } from '../../entities'
import { ConnectionArgs } from '../../input-types'
import { VerificationConnection } from '../../object-types'
import { ErrorCode, MyContext } from '../../types'
import { VerificationStatus } from '../../enums'
import { captureUserActivity } from '../../services'

export const getPendingVerificationsPaginated = async (
  options: ConnectionArgs,
  adminUser: User,
  context: MyContext
): Promise<VerificationConnection> => {
  if (!adminUser) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User is not authenticated',
        },
      ],
    }
  }

  const adminRole = (await adminUser.adminRole) as AdminRole
  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'verification'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canShowList) &&
    adminRole.roleName !== 'Administrator'
  ) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
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
  const connection = new VerificationConnection()

  const qb = getRepository(Verification)
    .createQueryBuilder('verification')
    .leftJoinAndSelect('verification.user', 'user')
    .leftJoinAndSelect('verification.biolink', 'biolink')
    .leftJoinAndSelect('biolink.username', 'username')
    .leftJoinAndSelect('verification.category', 'category')
    .where(`verification.verificationStatus = '${VerificationStatus.Pending}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(verification.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(verification.firstName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.lastName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.mobileNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.workNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.websiteLink) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.instagramUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.twitterUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.linkedinUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(username.username) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

  if (before) {
    qb.andWhere('verification.createdAt < :before', { before })
      .orderBy('verification.createdAt', 'DESC')
      .limit(options.first)
  } else if (after) {
    qb.andWhere('verification.createdAt > :after', { after })
      .orderBy('verification.createdAt', 'ASC')
      .limit(options.first)
  } else {
    qb.orderBy('verification.createdAt', 'ASC').limit(options.first)
  }

  const verifications = await qb.getMany()

  if (before) {
    verifications.reverse()
  }

  const firstVerification = verifications[0]
  const lastVerification = verifications[verifications.length - 1]

  // Checking if previous page and next page is present
  const minDate = moment(firstVerification?.createdAt).format('YYYY-MM-DD HH:mm:ss')
  const maxDate = moment(lastVerification?.createdAt).add(1, 's').format('YYYY-MM-DD HH:mm:ss') // add changes the dates, so it should be at the last

  connection.edges = verifications.map((verification) => ({
    node: verification,
    cursor: Buffer.from(moment(verification.createdAt).format('YYYY-MM-DD HH:mm:ss')).toString(
      'base64'
    ),
  }))

  const previousVerifications = await getRepository(Verification)
    .createQueryBuilder('verification')
    .leftJoinAndSelect('verification.user', 'user')
    .leftJoinAndSelect('verification.biolink', 'biolink')
    .leftJoinAndSelect('biolink.username', 'username')
    .leftJoinAndSelect('verification.category', 'category')
    .where(`verification.verificationStatus = '${VerificationStatus.Pending}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(verification.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(verification.firstName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.lastName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.mobileNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.workNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.websiteLink) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.instagramUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.twitterUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.linkedinUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(username.username) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('verification.createdAt < :minDate', { minDate })
    .getMany()

  const nextVerifications = await getRepository(Verification)
    .createQueryBuilder('verification')
    .leftJoinAndSelect('verification.user', 'user')
    .leftJoinAndSelect('verification.biolink', 'biolink')
    .leftJoinAndSelect('biolink.username', 'username')
    .leftJoinAndSelect('verification.category', 'category')
    .where(`verification.verificationStatus = '${VerificationStatus.Pending}'`)
    .andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(verification.username) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(verification.firstName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.lastName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.mobileNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.workNumber) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.websiteLink) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.instagramUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.twitterUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(verification.linkedinUrl) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(user.email) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(username.username) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )
    .andWhere('verification.createdAt > :maxDate', { maxDate })
    .getMany()

  connection.pageInfo = {
    startCursor: Buffer.from(
      moment(firstVerification?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    endCursor: Buffer.from(
      moment(lastVerification?.createdAt).format('YYYY-MM-DD HH:mm:ss') || ''
    ).toString('base64'),
    hasNextPage: !!nextVerifications.length,
    hasPreviousPage: !!previousVerifications.length,
  }

  await captureUserActivity(adminUser, context, `Requested pending verifications`, false)

  return connection
}
