import { Query, Resolver } from 'type-graphql'
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import {
  DashboardTotalCountsResponse,
  EarningChartResponse,
  UsersAdminsCountResponse,
} from '../../object-types'
import {
  getDashboardTotalCounts,
  getLast30DaysEarnings,
  getUsersAndAdminsCountData,
} from '../../services'

@Resolver()
export class DashboardAdminResolver {
  @Query(() => DashboardTotalCountsResponse)
  async getDashboardTotalCounts(
    @CurrentAdmin() adminUser: User
  ): Promise<DashboardTotalCountsResponse> {
    return await getDashboardTotalCounts(adminUser)
  }

  @Query(() => EarningChartResponse)
  async getLast30DaysEarningChartData(
    @CurrentAdmin() adminUser: User
  ): Promise<EarningChartResponse> {
    return await getLast30DaysEarnings(adminUser)
  }

  @Query(() => UsersAdminsCountResponse)
  async getUsersAndAdminsCountData(
    @CurrentAdmin() adminUser: User
  ): Promise<UsersAdminsCountResponse> {
    return await getUsersAndAdminsCountData(adminUser)
  }
}
