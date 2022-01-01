import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { ApolloError } from 'apollo-server-express'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Tax } from '../entities'
import { TaxUpdateBody } from '../interfaces/TaxUpdateBody'
import { PaginatedTaxResponse } from '../object-types/common/PaginatedTaxResponse'
import { ConnectionArgs } from '../input-types'
import { ErrorCode } from '../types'

@Service()
export class TaxService {
  constructor(@InjectRepository(Tax) private readonly taxRepository: Repository<Tax>) {}

  /**
   * Creates a new tax
   * @param {TaxUpdateBody} updateBody
   * @returns {Promise<boolean>}
   */
  async createTax(updateBody: TaxUpdateBody): Promise<Tax> {
    let tax = await this.taxRepository.create().save()

    tax = await this.updateTaxByTaxId(tax.id, updateBody)

    return tax
  }

  /**
   * Get tax by tax id
   * @param {string} taxId
   * @returns {Promise<Tax>}
   */
  async getTaxByTaxId(taxId: string): Promise<Tax> {
    const tax = await this.taxRepository.findOne(taxId)

    if (!tax) {
      throw new ApolloError('Tax not found', ErrorCode.TAX_NOT_FOUND)
    }

    return tax
  }

  /**
   * Update tax by tax id
   * @param {string} taxId
   * @param {TaxUpdateBody} updateBody
   * @returns {Promise<Tax>}
   */
  async updateTaxByTaxId(taxId: string, updateBody: TaxUpdateBody): Promise<Tax> {
    const tax = await this.getTaxByTaxId(taxId)

    if (updateBody.billingFor !== undefined) tax.billingFor = updateBody.billingFor
    if (updateBody.countries !== undefined) tax.countries = updateBody.countries
    if (updateBody.description !== undefined) tax.description = updateBody.description
    if (updateBody.internalName !== undefined) tax.internalName = updateBody.internalName
    if (updateBody.name !== undefined) tax.name = updateBody.name
    if (updateBody.type !== undefined) tax.type = updateBody.type
    if (updateBody.value !== undefined) tax.value = updateBody.value
    if (updateBody.valueType !== undefined) tax.valueType = updateBody.valueType

    await tax.save()

    return tax
  }

  /**
   * Get all taxes
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedTaxResponse>}
   */
  async getAllTaxes(options: ConnectionArgs): Promise<PaginatedTaxResponse> {
    const queryBuilder = this.taxRepository.createQueryBuilder('tax').where(
      new Brackets((qb) => {
        qb.where(`LOWER(tax.description) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
          .orWhere(`LOWER(tax.internalName) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
          .orWhere(`LOWER(tax.name) like :query`, {
            query: `%${options.query.toLowerCase()}%`,
          })
      })
    )

    const paginator = buildPaginator({
      entity: Tax,
      alias: 'tax',
      paginationKeys: ['id'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }

  /**
   * Soft Delete tax by tax id
   * @param {string} taxId
   * @returns {Promise<Tax>}
   */
  async softDeleteTaxByTaxId(taxId: string): Promise<Tax> {
    const tax = await this.getTaxByTaxId(taxId)

    await tax.softRemove()

    return tax
  }
}
