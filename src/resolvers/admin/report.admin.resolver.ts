import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { ConnectionArgs, ReportStatusInput } from '../../input-types'
import { ReportConnection, ReportResponse } from '../../object-types'
import {
  changeReportStatus,
  getDismissedReportsPaginated,
  getPendingReportsPaginated,
  getReport,
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

  @Query(() => ReportResponse, { nullable: true })
  async getReport(
    @Arg('reportId', () => String) reportId: string,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<ReportResponse> {
    return await getReport(reportId, adminUser, context)
  }

  @Mutation(() => ReportResponse, { nullable: true })
  async changeReportStatus(
    @Arg('reportId', () => String) reportId: string,
    @Arg('options', () => ReportStatusInput) options: ReportStatusInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<ReportResponse> {
    return await changeReportStatus(reportId, options, adminUser, context)
  }
}
