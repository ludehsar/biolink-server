import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { ConnectionArgs, NewTaxInput } from '../../input-types'
import { Tax } from '../../entities'
import { TaxController } from '../../controllers'
import { authAdmin } from '../../middlewares/authAdmin'
import { PaginatedTaxResponse } from '../../object-types/common/PaginatedTaxResponse'

@Resolver()
export class TaxAdminResolver {
  constructor(private readonly taxController: TaxController) {}

  @Query(() => PaginatedTaxResponse, { nullable: true })
  @UseMiddleware(authAdmin('tax.canShowList'))
  async getAllTaxes(@Arg('options') options: ConnectionArgs): Promise<PaginatedTaxResponse> {
    return await this.taxController.getAllTaxes(options)
  }

  @Query(() => Tax, { nullable: true })
  @UseMiddleware(authAdmin('tax.canShow'))
  async getTax(@Arg('taxId', () => String) taxId: string): Promise<Tax> {
    return await this.taxController.getTax(taxId)
  }

  @Mutation(() => Tax, { nullable: true })
  @UseMiddleware(authAdmin('tax.canCreate'))
  async addTax(@Arg('options') options: NewTaxInput): Promise<Tax> {
    return await this.taxController.addTax(options)
  }

  @Mutation(() => Tax, { nullable: true })
  @UseMiddleware(authAdmin('tax.canEdit'))
  async editTax(
    @Arg('taxId', () => String) taxId: string,
    @Arg('options') options: NewTaxInput
  ): Promise<Tax> {
    return await this.taxController.editTax(taxId, options)
  }

  @Mutation(() => Tax, { nullable: true })
  @UseMiddleware(authAdmin('tax.canDelete'))
  async deleteTax(@Arg('taxId', () => String) taxId: string): Promise<Tax> {
    return await this.taxController.deleteTax(taxId)
  }
}
