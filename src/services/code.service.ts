import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { ApolloError } from 'apollo-server-errors'
import * as randToken from 'rand-token'

import { Code, User } from '../entities'
import { ErrorCode } from '../types'
import { CodeType } from '../enums'
import { stripe } from '../utilities'

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
      referrer: Promise.resolve(user),
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
}
