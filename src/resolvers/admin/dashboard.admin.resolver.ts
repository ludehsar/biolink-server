import { Query, Resolver } from 'type-graphql'
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { DashboardTotalCountsResponse } from '../../object-types'
import { getDashboardTotalCounts } from '../../services'

@Resolver()
export class DashboardAdminResolver {
  @Query(() => DashboardTotalCountsResponse)
  async getDashboardTotalCounts(
    @CurrentAdmin() adminUser: User
  ): Promise<DashboardTotalCountsResponse> {
    return await getDashboardTotalCounts(adminUser)
  }
}
