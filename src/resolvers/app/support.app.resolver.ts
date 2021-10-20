import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'

import { MyContext } from '../../types'
import { NewSupportInput } from '../../input-types'
import { Support } from '../../entities'
import { authUser, emailVerified } from '../../middlewares'
import { SupportController } from '../../controllers'

@Resolver()
export class SupportResolver {
  constructor(private readonly supportController: SupportController) {}

  @Mutation(() => Support, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async addSupport(
    @Arg('options') options: NewSupportInput,
    @Ctx() context: MyContext
  ): Promise<Support> {
    return await this.supportController.addSupport(options, context)
  }
}
