import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { ConnectionArgs, NewCodeInput } from '../../input-types'
import { CodeConnection, CodeResponse } from '../../object-types'
import {
  addCode,
  editCode,
  getCode,
  getDiscountCodesPaginated,
  getReferralCodesPaginated,
} from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class CodeAdminResolver {
  @Query(() => CodeConnection, { nullable: true })
  async getAllDiscounts(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<CodeConnection> {
    return await getDiscountCodesPaginated(options, adminUser, context)
  }

  @Query(() => CodeConnection, { nullable: true })
  async getAllReferrals(
    @Arg('options') options: ConnectionArgs,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<CodeConnection> {
    return await getReferralCodesPaginated(options, adminUser, context)
  }

  @Query(() => CodeResponse, { nullable: true })
  async getCode(
    @Arg('codeId', () => String) codeId: string,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<CodeResponse> {
    return await getCode(codeId, adminUser, context)
  }

  @Mutation(() => CodeResponse, { nullable: true })
  async addCode(
    @Arg('options') options: NewCodeInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<CodeResponse> {
    return await addCode(options, adminUser, context)
  }

  @Mutation(() => CodeResponse, { nullable: true })
  async editCode(
    @Arg('codeId', () => String) codeId: string,
    @Arg('options') options: NewCodeInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<CodeResponse> {
    return await editCode(codeId, options, adminUser, context)
  }
}
