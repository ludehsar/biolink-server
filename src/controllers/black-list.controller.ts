import { Service } from 'typedi'

import { BlackListService } from '../services/blacklist.service'
import { ConnectionArgs, NewBlackListInput } from '../input-types'
import { PaginatedBlackListResponse } from '../object-types/common/PaginatedBlackListResponse'
import { BlacklistType } from '../enums'
import { BlackList } from '../entities'

@Service()
export class BlackListController {
  constructor(private readonly blackListService: BlackListService) {}

  async getAllBadWords(options: ConnectionArgs): Promise<PaginatedBlackListResponse> {
    return await this.blackListService.getAllBlackLists(BlacklistType.BadWord, options)
  }

  async getAllBlacklistedEmails(options: ConnectionArgs): Promise<PaginatedBlackListResponse> {
    return await this.blackListService.getAllBlackLists(BlacklistType.Email, options)
  }

  async getAllBlacklistedUsernames(options: ConnectionArgs): Promise<PaginatedBlackListResponse> {
    return await this.blackListService.getAllBlackLists(BlacklistType.Username, options)
  }

  async getBlackList(id: string): Promise<BlackList> {
    return await this.blackListService.getBlackListById(id)
  }

  async createBlackList(input: NewBlackListInput): Promise<BlackList> {
    return await this.blackListService.createBlackList({
      blacklistType: input.blacklistType,
      keyword: input.keyword,
      reason: input.reason,
    })
  }

  async updateBlackList(blacklistId: string, input: NewBlackListInput): Promise<BlackList> {
    return await this.blackListService.updateBlacklistById(blacklistId, {
      blacklistType: input.blacklistType,
      keyword: input.keyword,
      reason: input.reason,
    })
  }

  async deleteBlackList(blacklistId: string): Promise<BlackList> {
    return await this.blackListService.softRemoveBlackListById(blacklistId)
  }
}
