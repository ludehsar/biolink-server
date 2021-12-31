import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ConnectionArgs, ReportStatusInput } from '../../input-types'
import { Report } from '../../entities'
import { ReportController } from '../../controllers'
import { authAdmin } from '../../middlewares/authAdmin'
import { PaginatedReportResponse } from '../../object-types/common/PaginatedReportResponse'

@Resolver()
export class ReportAdminResolver {
  constructor(private readonly reportController: ReportController) {}

  @Query(() => PaginatedReportResponse, { nullable: true })
  @UseMiddleware(authAdmin('report.canShowList'))
  async getAllPendingReports(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedReportResponse> {
    return await this.reportController.getAllPendingReports(options)
  }

  @Query(() => PaginatedReportResponse, { nullable: true })
  @UseMiddleware(authAdmin('report.canShowList'))
  async getAllResolvedReports(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedReportResponse> {
    return await this.reportController.getAllResolvedReports(options)
  }

  @Query(() => PaginatedReportResponse, { nullable: true })
  @UseMiddleware(authAdmin('report.canShowList'))
  async getAllDismissedReports(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedReportResponse> {
    return await this.reportController.getAllDismissedReports(options)
  }

  @Query(() => Report, { nullable: true })
  @UseMiddleware(authAdmin('report.canShow'))
  async getReport(@Arg('reportId', () => String) reportId: string): Promise<Report> {
    return await this.reportController.getReport(reportId)
  }

  @Mutation(() => Report, { nullable: true })
  @UseMiddleware(authAdmin('report.canEdit'))
  async changeReportStatus(
    @Arg('reportId', () => String) reportId: string,
    @Arg('options', () => ReportStatusInput) options: ReportStatusInput
  ): Promise<Report> {
    return await this.reportController.changeReportStatus(reportId, options)
  }
}
