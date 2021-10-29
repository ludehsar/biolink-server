import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'

import { MyContext } from '../../types'
import { NewServiceInput } from '../../input-types'
import { Service } from '../../entities'
import { authUser, emailVerified } from '../../middlewares'
import { ServiceController } from '../../controllers'

@Resolver()
export class ServiceResolver {
  constructor(private readonly serviceController: ServiceController) {}

  @Mutation(() => Service, { nullable: true })
  @UseMiddleware(authUser, emailVerified)
  async createService(
    @Arg('options') options: NewServiceInput,
    @Ctx() context: MyContext
  ): Promise<Service> {
    return await this.serviceController.createService(options, context)
  }
}
