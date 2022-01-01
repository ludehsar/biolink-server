import { Service } from 'typedi'

import { Username } from '../entities'
import { UsernameService } from '../services/username.service'
import { ConnectionArgs, NewUsernameInput } from '../input-types'
import { PaginatedUsernameResponse } from '../object-types/common/PaginatedUsernameResponse'
import { UserService } from '../services/user.service'
import { PremiumUsernameType } from '../enums'

@Service()
export class UsernameController {
  constructor(
    private readonly usernameService: UsernameService,
    private readonly userService: UserService
  ) {}

  async addUsername(input: NewUsernameInput): Promise<Username> {
    let owner = undefined
    if (input.ownerId) {
      owner = await this.userService.getUserById(input.ownerId)
    }

    return await this.usernameService.createUsername(input.username as string, {
      owner,
      premiumType: input.premiumType,
    })
  }

  async getAllUsernames(options: ConnectionArgs): Promise<PaginatedUsernameResponse> {
    return await this.usernameService.getAllUsernames(PremiumUsernameType.None, options)
  }

  async getAllPremiumUsernames(options: ConnectionArgs): Promise<PaginatedUsernameResponse> {
    return await this.usernameService.getAllUsernames(PremiumUsernameType.Premium, options)
  }

  async getAllTrademarkUsernames(options: ConnectionArgs): Promise<PaginatedUsernameResponse> {
    return await this.usernameService.getAllUsernames(PremiumUsernameType.Trademark, options)
  }

  async getUsername(usernameId: string): Promise<Username> {
    return await this.usernameService.getUsernameById(usernameId)
  }

  async editUsername(usernameId: string, input: NewUsernameInput): Promise<Username> {
    let owner = undefined
    if (input.ownerId) {
      owner = await this.userService.getUserById(input.ownerId)
    }

    return await this.usernameService.updateUsernameById(usernameId, {
      owner,
      premiumType: input.premiumType,
    })
  }

  async deleteUsername(usernameId: string): Promise<Username> {
    return await this.usernameService.softDeleteUsernameById(usernameId)
  }
}
