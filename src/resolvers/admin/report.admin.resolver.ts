import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { ConnectionArgs } from '../../input-types'
import { ReportConnection } from '../../object-types'
import {
  getDismissedReportsPaginated,
  getPendingReportsPaginated,
  getResolvedReportsPaginated,
} from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class ReportAdminResolver {
  @Query(() => ReportConnection, { nullable: true })
  async getAllPendingReports(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<ReportConnection> {
    return await getPendingReportsPaginated(options, adminUser, context)
  }

  @Query(() => ReportConnection, { nullable: true })
  async getAllResolvedReports(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<ReportConnection> {
    return await getResolvedReportsPaginated(options, adminUser, context)
  }

  @Query(() => ReportConnection, { nullable: true })
  async getAllDismissedReports(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<ReportConnection> {
    return await getDismissedReportsPaginated(options, adminUser, context)
  }
}
