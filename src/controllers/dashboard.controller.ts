import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { IsNull, Not, Repository } from 'typeorm'

import { Biolink, Code, Link, Payment, TrackLink, User } from '../entities'
import {
  DashboardTotalCounts,
  EarningChartResponse,
  UsersAdminsCountResponse,
} from '../object-types'

@Service()
export class DashboardController {
  constructor(
    @InjectRepository(Biolink) private readonly biolinkRepository: Repository<Biolink>,
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
    @InjectRepository(TrackLink) private readonly tracklinkRepository: Repository<TrackLink>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Code) private readonly codeRepository: Repository<Code>,
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>
  ) {}

  async getDashboardTotalCounts(): Promise<DashboardTotalCounts> {
    const totalBiolinks = await this.biolinkRepository.count()
    const totalShortenedLinks = await this.linkRepository.count()
    const totalBiolinkPageViewsTracked = await this.tracklinkRepository.count({
      where: { link: IsNull() },
    })
    const totalLinkClickViewsTracked = await this.tracklinkRepository.count({
      where: { biolink: IsNull() },
    })
    const totalUsers = await this.userRepository.count()
    const totalReferralCodes = await this.codeRepository.count()
    const totalTransactionsMade = await this.paymentRepository.count()
    const { totalEarned } = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amountPaid)', 'totalEarned')
      .getRawOne()

    return {
      totalBiolinkPageViewsTracked,
      totalBiolinks,
      totalEarned,
      totalLinkClickViewsTracked,
      totalReferralCodes,
      totalShortenedLinks,
      totalTransactionsMade,
      totalUsers,
    }
  }

  async getLast30DaysEarnings(): Promise<EarningChartResponse> {
    const result = await this.paymentRepository.query(
      `
        SELECT date, coalesce(earned, 0) as earned
        FROM  (
          SELECT "date"::date
          FROM generate_series(current_date - interval '30 days'
                            ,  current_date
                            ,  interval  '1 day') "date"
          ) d
        LEFT JOIN (
          SELECT "payment"."createdAt"::date AS date
                , sum("payment"."amountPaid") AS earned
          FROM   "payment" "payment"
          WHERE  "payment"."createdAt" >= current_date - interval '30 days'
          GROUP  BY 1
          ) t USING (date)
        ORDER  BY date;
      `
    )

    return {
      result,
    }
  }

  async getUsersAndAdminsCountData(): Promise<UsersAdminsCountResponse> {
    const totalUsers = await User.count({ where: { adminRole: IsNull() } })
    const totalAdmins = await User.count({ where: { adminRole: Not(IsNull()) } })

    return {
      totalAdmins,
      totalUsers,
    }
  }
}
