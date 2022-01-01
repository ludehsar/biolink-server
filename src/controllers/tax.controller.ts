import { Service } from 'typedi'

import { Tax } from '../entities'
import { TaxService } from '../services/tax.service'
import { ConnectionArgs, NewTaxInput } from '../input-types'
import { PaginatedTaxResponse } from '../object-types/common/PaginatedTaxResponse'

@Service()
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  async addTax(input: NewTaxInput): Promise<Tax> {
    return await this.taxService.createTax({
      billingFor: input.billingFor,
      countries: input.countries,
      description: input.description,
      internalName: input.internalName,
      name: input.name,
      type: input.type,
      value: input.value,
      valueType: input.valueType,
    })
  }

  async getAllTaxes(options: ConnectionArgs): Promise<PaginatedTaxResponse> {
    return await this.taxService.getAllTaxes(options)
  }

  async getTax(taxId: string): Promise<Tax> {
    return await this.taxService.getTaxByTaxId(taxId)
  }

  async editTax(taxId: string, input: NewTaxInput): Promise<Tax> {
    return await this.taxService.updateTaxByTaxId(taxId, {
      billingFor: input.billingFor,
      countries: input.countries,
      description: input.description,
      internalName: input.internalName,
      name: input.name,
      type: input.type,
      value: input.value,
      valueType: input.valueType,
    })
  }

  async deleteTax(taxId: string): Promise<Tax> {
    return await this.taxService.softDeleteTaxByTaxId(taxId)
  }
}
