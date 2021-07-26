import { getRepository } from 'typeorm'
import { ErrorCode } from '../../types'
import { Biolink, Link, User, Code, Payment } from '../../entities'
import { UserTotalCountsResponse } from '../../object-types'

export const getUserSummaryCounts = async (
  userId: string,
  adminUser: User
): Promise<UserTotalCountsResponse> => {
  const user = await User.findOne(userId)

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_FOUND,
          message: 'User not found',
        },
      ],
    }
  }

  if (!adminUser) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  const adminRole = await adminUser.adminRole

  const adminRoleSettings = adminRole.roleSettings || []

  const userSettings = adminRoleSettings.find((role): boolean => {
    return role.resource === 'user'
  })

  if (
    (!adminRole || !userSettings || !userSettings.canShow) &&
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

  if (!adminRole) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User is not authorized',
        },
      ],
    }
  }

  const totalBiolinks = await Biolink.count({ where: { user } })
  const totalShortenedLinks = await Link.count({ where: { user } })
  const totalReferralCodes = await Code.count({ where: { referrer: user } })
  const { totalPayed } = await getRepository(Payment)
    .createQueryBuilder('payment')
    .where('payment.userId = :userId', { userId: user.id })
    .select('SUM(payment.stripeAmountPaid)', 'totalPayed')
    .getRawOne()

  return {
    result: {
      totalBiolinks,
      totalReferralCodes,
      totalShortenedLinks,
      totalPayed,
    },
  }
}
