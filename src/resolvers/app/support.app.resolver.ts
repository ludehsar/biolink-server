import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'

import { MyContext } from '../../types'
import { NewSupportInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { addSupport } from '../../services'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'

@Resolver()
export class SupportResolver {
  @Mutation(() => DefaultResponse, { nullable: true })
  async addSupport(
    @Arg('options') options: NewSupportInput,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await addSupport(options, user, context)
  }
}
