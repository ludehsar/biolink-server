import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'

import { MyContext } from '../../types'
import { NewSupportInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { addSupport } from '../../services'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { emailVerified } from '../../middlewares'

@Resolver()
export class SupportResolver {
  @Mutation(() => DefaultResponse, { nullable: true })
  @UseMiddleware(emailVerified)
  async addSupport(
    @Arg('options') options: NewSupportInput,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await addSupport(options, user, context)
  }
}
