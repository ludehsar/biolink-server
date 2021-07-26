import { getRepository, IsNull } from 'typeorm'
import { ErrorCode } from '../../types'
import { Biolink, Link, TrackLink, User, Code, Payment } from '../../entities'
import { DashboardTotalCountsResponse } from '../../object-types'

export const getDashboardTotalCounts = async (
  adminUser: User
): Promise<DashboardTotalCountsResponse> => {
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

  const adminRole = await adminUser.adminRole

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

  const totalBiolinks = await Biolink.count()
  const totalShortenedLinks = await Link.count()
  const totalBiolinkPageViewsTracked = await TrackLink.count({ where: { link: IsNull() } })
  const totalLinkClickViewsTracked = await TrackLink.count({ where: { biolink: IsNull() } })
  const totalUsers = await User.count()
  const totalReferralCodes = await Code.count()
  const totalTransactionsMade = await Payment.count()
  const { totalEarned } = await getRepository(Payment)
    .createQueryBuilder('payment')
    .select('SUM(payment.stripeAmountPaid)', 'totalEarned')
    .getRawOne()

  return {
    result: {
      totalBiolinkPageViewsTracked,
      totalBiolinks,
      totalEarned,
      totalLinkClickViewsTracked,
      totalReferralCodes,
      totalShortenedLinks,
      totalTransactionsMade,
      totalUsers,
    },
  }
}
