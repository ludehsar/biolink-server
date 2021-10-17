import { Service } from 'typedi'

import { ErrorCode, MyContext } from '../types'
import { Report, User } from '../entities'
import { ReportService } from '../services/report.service'
import { NewReportInput } from '../input-types'
import { isMalicious } from '../utilities'
import { ApolloError } from 'apollo-server-errors'

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
}
