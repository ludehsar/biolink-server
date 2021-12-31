import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { ApolloError } from 'apollo-server-express'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ResolveStatus } from '../enums'
import { Report } from '../entities'
import { ReportUpdateBody } from '../interfaces/ReportUpdateBody'
import { PaginatedReportResponse } from '../object-types/common/PaginatedReportResponse'
import { ConnectionArgs } from '../input-types'
import { ErrorCode } from '../types'

@Service()
export class ReportService {
  constructor(@InjectRepository(Report) private readonly reportRepository: Repository<Report>) {}

  /**
   * Creates a new report
   * @param {ReportUpdateBody} updateBody
   * @returns {Promise<boolean>}
   */
  async createReport(updateBody: ReportUpdateBody): Promise<Report> {
    const report = this.reportRepository.create({
      description: updateBody.description,
      email: updateBody.email,
      firstName: updateBody.firstName,
      lastName: updateBody.lastName,
      reportedUrl: updateBody.reportedUrl,
      status: ResolveStatus.Pending,
    })

    if (updateBody.user !== undefined) report.reporter = Promise.resolve(updateBody.user)

    await report.save()

    return report
  }

  /**
   * Get report by report id
   * @param {string} reportId
   * @returns {Promise<Report>}
   */
  async getReportByReportId(reportId: string): Promise<Report> {
    const report = await this.reportRepository.findOne(reportId)

    if (!report) {
      throw new ApolloError('Report not found', ErrorCode.REPORT_NOT_FOUND)
    }

    return report
  }

  /**
   * Get report by report id
   * @param {string} reportId
   * @param {ResolveStatus} status
   * @returns {Promise<Report>}
   */
  async changeReportStatusByReportId(reportId: string, status: ResolveStatus): Promise<Report> {
    const report = await this.getReportByReportId(reportId)

    report.status = status
    await report.save()

    return report
  }

  /**
   * Get all reports
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedReportResponse>}
   */
  async getAllReports(
    status: ResolveStatus,
    options: ConnectionArgs
  ): Promise<PaginatedReportResponse> {
    const queryBuilder = this.reportRepository
      .createQueryBuilder('report')
      .where('report.status = :status', { status })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`LOWER(report.description) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
            .orWhere(`LOWER(report.email) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(report.firstName) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(report.lastName) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
            .orWhere(`LOWER(report.reportedUrl) like :query`, {
              query: `%${options.query.toLowerCase()}%`,
            })
        })
      )

    const paginator = buildPaginator({
      entity: Report,
      alias: 'report',
      paginationKeys: ['id'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }
}
