import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'

import { MyContext } from '../../types'
import { NewReportInput } from '../../input-types'
import { Report } from '../../entities'
import { authUser, emailVerified } from '../../middlewares'
import { ReportController } from '../../controllers'

@Resolver()
export class ReportResolver {
  constructor(private readonly reportController: ReportController) {}

  @Mutation(() => Report, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async addReport(
    @Arg('options') options: NewReportInput,
    @Ctx() context: MyContext
  ): Promise<Report> {
    return await this.reportController.addReport(options, context)
  }
}
