import { Service } from 'typedi'

import { MyContext } from '../types'
import { Follow, User } from '../entities'
import { FollowService } from '../services/follow.service'
import { BiolinkService } from '../services/biolink.service'
import { ConnectionArgs } from '../input-types'
import { PaginatedBiolinkResponse } from '../object-types/common/PaginatedBiolinkResponse'

@Service()
export class FollowController {
  constructor(
    private readonly followService: FollowService,
    private readonly biolinkService: BiolinkService
  ) {}

  async followBiolink(biolinkId: string, context: MyContext): Promise<Follow> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)
    return await this.followService.findOneOrFollow(context.user as User, biolink)
  }

  async unfollowBiolink(biolinkId: string, context: MyContext): Promise<Follow> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)
    return await this.followService.unfollow(context.user as User, biolink)
  }

  async getFollowingStatus(biolinkId: string, context: MyContext): Promise<boolean> {
    const biolink = await this.biolinkService.getBiolinkById(biolinkId)
    return await this.followService.isUserFollowingBiolink(context.user as User, biolink)
  }

  async getFollowingBiolinks(
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedBiolinkResponse> {
    return await this.followService.getFollowingBiolinksByUserId((context.user as User).id, options)
  }
}
