import { Query, Resolver, UseMiddleware } from 'type-graphql'

import {
  DashboardTotalCounts,
  EarningChartResponse,
  UsersAdminsCountResponse,
} from '../../object-types'
import { DashboardController } from '../../controllers'
import { authAdmin } from '../../middlewares/authAdmin'

@Resolver()
export class DashboardAdminResolver {
  constructor(private readonly dashboardController: DashboardController) {}

  @Query(() => DashboardTotalCounts)
  @UseMiddleware(authAdmin())
  async getDashboardTotalCounts(): Promise<DashboardTotalCounts> {
    return await this.dashboardController.getDashboardTotalCounts()
  }

  @Query(() => EarningChartResponse)
  @UseMiddleware(authAdmin())
  async getLast30DaysEarningChartData(): Promise<EarningChartResponse> {
    return await this.dashboardController.getLast30DaysEarnings()
  }

  @Query(() => UsersAdminsCountResponse)
  @UseMiddleware(authAdmin())
  async getUsersAndAdminsCountData(): Promise<UsersAdminsCountResponse> {
    return await this.dashboardController.getUsersAndAdminsCountData()
  }
}
