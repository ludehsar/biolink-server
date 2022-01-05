import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { ApolloError } from 'apollo-server-errors'
import * as randToken from 'rand-token'

import { Code, User } from '../entities'
import { ErrorCode } from '../types'
import { CodeType } from '../enums'
import { stripe } from '../utilities'
import { ConnectionArgs } from 'input-types'
import { PaginatedCodeResponse } from 'object-types/common/PaginatedCodeResponse'
import { buildPaginator } from 'typeorm-cursor-pagination'
import moment from 'moment'
import { CodeUpdateBody } from 'interfaces/CodeUpdateBody'

@Service()
export class CodeService {
  constructor(@InjectRepository(Code) private readonly codeRepository: Repository<Code>) {}

  /**
   * Gets code object from referral code
   * @param {string} referralCode
   * @returns {Promise<Code>}
   */
  async getCodeByReferralCode(referralCode: string): Promise<Code> {
    const codeDoc = await this.codeRepository.findOne({
      where: {
        code: referralCode,
      },
    })

    if (!codeDoc) {
      throw new ApolloError('Invalid referral token', ErrorCode.CODE_NOT_FOUND)
    }

    return codeDoc
  }

  /**
   * Gets code object by code id
   * @param {string} codeId
   * @returns {Promise<Code>}
   */
  async getCodeByCodeId(codeId: string): Promise<Code> {
    const codeDoc = await this.codeRepository.findOne(codeId)

    if (!codeDoc) {
      throw new ApolloError('Invalid code id', ErrorCode.CODE_NOT_FOUND)
    }

    return codeDoc
  }

  /**
   * Gets code object from referral code
   * @param {User} referrer
   * @returns {Promise<Code>}
   */
  async findOrCreateReferralCodeByReferrerId(referrer: User): Promise<Code> {
    let referralCodeDoc = await this.codeRepository.findOne({
      where: { referrer, type: CodeType.Referral },
    })

    if (!referralCodeDoc) {
      referralCodeDoc = await this.createReferralCode(referrer)
    }

    return referralCodeDoc
  }

  /**
   * Create referral code
   * @param {User} user
   * @returns {Promise<Code>}
   */
  async createReferralCode(user: User): Promise<Code> {
    const code = Code.create({
      code: randToken.generate(10),
      discount: 20,
      quantity: -1,
      type: CodeType.Referral,
    })
    code.referrer = Promise.resolve(user)

    await code.save()

    await stripe.coupons.create({
      id: code.code,
      percent_off: code.discount,
      duration: 'once',
    })

    return code
  }

  /**
   * Create code
   * @param {CodeUpdateBody} updateBody
   * @returns {Promise<Code>}
   */
  async createCode(updateBody: CodeUpdateBody): Promise<Code> {
    try {
      const code = this.codeRepository.create({
        code: updateBody.code,
        discount: updateBody.discount,
        expireDate: updateBody.expireDate,
        quantity: updateBody.quantity,
        type: updateBody.type,
      })

      if (updateBody.referrer !== undefined) code.referrer = Promise.resolve(updateBody.referrer)

      await stripe.coupons.create({
        id: code.code,
        max_redemptions: code.quantity > 0 ? code.quantity : undefined,
        percent_off: code.discount,
        duration: 'once',
        redeem_by: moment(code.expireDate).unix() || undefined,
      })

      await code.save()

      return code
    } catch (err: any) {
      throw new ApolloError(err.message, ErrorCode.DATABASE_ERROR)
    }
  }

  /**
   * Update code by code id
   * @param {string} codeId
   * @param {CodeUpdateBody} updateBody
   * @returns {Promise<Code>}
   */
  async updateCodeById(codeId: string, updateBody: CodeUpdateBody): Promise<Code> {
    const code = await this.getCodeByCodeId(codeId)
    const prevCode = code.code

    if (updateBody.code !== undefined) code.code = updateBody.code
    if (updateBody.discount !== undefined) code.discount = updateBody.discount
    if (updateBody.expireDate !== undefined) code.expireDate = updateBody.expireDate
    if (updateBody.quantity !== undefined) code.quantity = updateBody.quantity
    if (updateBody.referrer !== undefined) code.referrer = Promise.resolve(updateBody.referrer)
    if (updateBody.type !== undefined) code.type = updateBody.type

    try {
      await stripe.coupons.del(prevCode)

      await stripe.coupons.create({
        id: code.code,
        max_redemptions: code.quantity > 0 ? code.quantity : undefined,
        percent_off: code.discount,
        duration: 'once',
        redeem_by: moment(code.expireDate).unix() || undefined,
      })

      await code.save()
    } catch (err: any) {
      throw new ApolloError(err.message, ErrorCode.DATABASE_ERROR)
    }

    return code
  }

  /**
   * Delete code by code id
   * @param {Code} codeId
   * @returns {Promise<Code>}
   */
  async softRemoveCodeByCodeId(codeId: string): Promise<Code> {
    const code = await this.getCodeByCodeId(codeId)

    await code.softRemove()

    await stripe.coupons.del(code.code)

    return code
  }

  /**
   * Get all codes
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedCodeResponse>}
   */
  async getAllCodes(type: CodeType, options: ConnectionArgs): Promise<PaginatedCodeResponse> {
    const queryBuilder = this.codeRepository
      .createQueryBuilder('code')
      .where('code.type = :type', { type })
      .andWhere(`LOWER(code.code) like :query`, {
        query: `%${options.query.toLowerCase()}%`,
      })

    const paginator = buildPaginator({
      entity: Code,
      alias: 'code',
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
}
