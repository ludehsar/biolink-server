import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'

import { MyContext } from '../../types'
import { NewReportInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { addReport } from '../../services'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { emailVerified } from '../../middlewares'

@Resolver()
export class ReportResolver {
  @Mutation(() => DefaultResponse, { nullable: true })
  @UseMiddleware(emailVerified)
  async addReport(
    @Arg('options') options: NewReportInput,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await addReport(options, user, context)
  }
}
