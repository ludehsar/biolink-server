import { Service } from 'typedi'

import { BlackListService } from '../services/blacklist.service'
import { ConnectionArgs } from '../input-types'
import { PaginatedBlackListResponse } from '../object-types/common/PaginatedBlackListResponse'
import { BlacklistType } from '../enums'

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
}
