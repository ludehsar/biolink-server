import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import { ConnectionArgsOld, NewTaxInput } from '../../input-types'
import { TaxConnection, TaxResponse } from '../../object-types'
import { addTax, editTax, getTax, getTaxesPaginated } from '../../services'
import { User } from '../../entities'
import { CurrentAdmin } from '../../decorators'
import { MyContext } from '../../types'

@Resolver()
export class TaxAdminResolver {
  @Query(() => TaxConnection, { nullable: true })
  async getAllTaxes(
    @Arg('options') options: ConnectionArgsOld,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<TaxConnection> {
    return await getTaxesPaginated(options, adminUser, context)
  }

  @Query(() => TaxResponse, { nullable: true })
  async getTax(
    @Arg('taxId', () => Int) taxId: number,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<TaxResponse> {
    return await getTax(taxId, adminUser, context)
  }

  @Mutation(() => TaxResponse, { nullable: true })
  async addTax(
    @Arg('options') options: NewTaxInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<TaxResponse> {
    return await addTax(options, adminUser, context)
  }

  @Mutation(() => TaxResponse, { nullable: true })
  async editTax(
    @Arg('taxId', () => Int) taxId: number,
    @Arg('options') options: NewTaxInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<TaxResponse> {
    return await editTax(taxId, options, adminUser, context)
  }
}
