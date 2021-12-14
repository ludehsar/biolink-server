import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ResolveStatus } from '../enums'
import { Report } from '../entities'
import { ReportUpdateBody } from '../interfaces/ReportUpdateBody'

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
}
