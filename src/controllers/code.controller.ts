import { Service } from 'typedi'

import { CodeService } from '../services/code.service'
import { ConnectionArgs, NewCodeInput } from '../input-types'
import { CodeType } from '../enums'
import { PaginatedCodeResponse } from '../object-types/common/PaginatedCodeResponse'
import { Code } from '../entities'
import { UserService } from '../services/user.service'

@Service()
export class CodeController {
  constructor(
    private readonly codeService: CodeService,
    private readonly userService: UserService
  ) {}

  async getAllReferralCodes(options: ConnectionArgs): Promise<PaginatedCodeResponse> {
    return await this.codeService.getAllCodes(options, CodeType.Referral)
  }

  async getAllDiscountCodes(options: ConnectionArgs): Promise<PaginatedCodeResponse> {
    return await this.codeService.getAllCodes(options, CodeType.Discount)
  }

  async getAllCodes(options: ConnectionArgs): Promise<PaginatedCodeResponse> {
    return await this.codeService.getAllCodes(options)
  }

  async getCode(codeId: string): Promise<Code> {
    return await this.codeService.getCodeByCodeId(codeId)
  }

  async createCode(input: NewCodeInput): Promise<Code> {
    let referrer = undefined
    if (input.referrerId) {
      referrer = await this.userService.getUserById(input.referrerId)
    }

    return await this.codeService.createCode({
      code: input.code,
      discount: input.discount,
      expireDate: input.expireDate,
      quantity: input.quantity,
      referrer,
      type: input.type,
    })
  }

  async updateCode(codeId: string, input: NewCodeInput): Promise<Code> {
    let referrer = undefined
    if (input.referrerId) {
      referrer = await this.userService.getUserById(input.referrerId)
    }

    return await this.codeService.updateCodeById(codeId, {
      code: input.code,
      discount: input.discount,
      expireDate: input.expireDate,
      quantity: input.quantity,
      referrer,
      type: input.type,
    })
  }

  async deleteCode(codeId: string): Promise<Code> {
    return await this.codeService.softRemoveCodeByCodeId(codeId)
  }
}
