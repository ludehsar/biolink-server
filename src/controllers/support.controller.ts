import { Service } from 'typedi'

import { MyContext } from '../types'
import { Support } from '../entities'
import { SupportService } from '../services/support.service'
import { ConnectionArgs, NewSupportInput, SupportAdminInput } from '../input-types'
import { ResolveStatus } from '../enums'
import { PaginatedSupportResponse } from '../object-types/common/PaginatedSupportSettings'

@Service()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  async addSupport(input: NewSupportInput, context: MyContext): Promise<Support> {
    return await this.supportService.createSupport({
      company: input.company,
      email: input.email,
      fullName: input.fullName,
      message: input.message,
      phoneNumber: input.phoneNumber,
      subject: input.subject,
      user: context.user,
    })
  }

  async getAllPendingSupports(options: ConnectionArgs): Promise<PaginatedSupportResponse> {
    return await this.supportService.getAllSupports(ResolveStatus.Pending, options)
  }

  async getAllResolvedSupports(options: ConnectionArgs): Promise<PaginatedSupportResponse> {
    return await this.supportService.getAllSupports(ResolveStatus.Resolved, options)
  }

  async getAllDismissedSupports(options: ConnectionArgs): Promise<PaginatedSupportResponse> {
    return await this.supportService.getAllSupports(ResolveStatus.Dismissed, options)
  }

  async getSupport(supportId: string): Promise<Support> {
    return await this.supportService.getSupportBySupportId(supportId)
  }

  async replySupportBySupportId(supportId: string, input: SupportAdminInput): Promise<Support> {
    return await this.supportService.replySupportBySupportId(supportId, {
      status: input.status,
      supportReply: input.supportReply,
    })
  }
}
