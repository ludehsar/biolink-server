import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'

import { ErrorCode, MyContext } from '../types'
import { Report, User } from '../entities'
import { ReportService } from '../services/report.service'
import { ConnectionArgs, NewReportInput, ReportStatusInput } from '../input-types'
import { isMalicious } from '../utilities'
import { PaginatedReportResponse } from '../object-types/common/PaginatedReportResponse'
import { ResolveStatus } from '../enums'

@Service()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  async addReport(input: NewReportInput, context: MyContext): Promise<Report> {
    const malicious = await isMalicious([input.reportedUrl || ''])

    if (malicious) {
      throw new ApolloError('Reported URL is malicious', ErrorCode.LINK_IS_MALICIOUS)
    }

    return await this.reportService.createReport({
      description: input.description,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      reportedUrl: input.reportedUrl,
      user: context.user as User,
    })
  }

  async getAllPendingReports(options: ConnectionArgs): Promise<PaginatedReportResponse> {
    return await this.reportService.getAllReports(ResolveStatus.Pending, options)
  }

  async getAllResolvedReports(options: ConnectionArgs): Promise<PaginatedReportResponse> {
    return await this.reportService.getAllReports(ResolveStatus.Resolved, options)
  }

  async getAllDismissedReports(options: ConnectionArgs): Promise<PaginatedReportResponse> {
    return await this.reportService.getAllReports(ResolveStatus.Dismissed, options)
  }

  async getReport(reportId: string): Promise<Report> {
    return await this.reportService.getReportByReportId(reportId)
  }

  async changeReportStatus(reportId: string, input: ReportStatusInput): Promise<Report> {
    return await this.reportService.changeReportStatusByReportId(reportId, input.status)
  }
}
