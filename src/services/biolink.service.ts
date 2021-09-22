import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { Biolink, User } from '../entities'
import { UsernameService } from './username.service'
import { ErrorCode } from '../types'
import { BlackListService } from './blacklist.service'
import { BlacklistType } from '../enums'

@Service()
export class BiolinkService {
  constructor(
    @InjectRepository(Biolink) private readonly biolinkRepository: Repository<Biolink>,
    private readonly usernameService: UsernameService,
    private readonly blacklistService: BlackListService
  ) {}

  /**
   * Create a biolink
   * @param {User} user
   * @param {string} username
   * @returns {Promise<Biolink>}
   */
  async createBiolink(user: User, username: string): Promise<Biolink> {
    if (await this.usernameService.isUsernameTaken(username)) {
      throw new ApolloError('Username is already taken', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    if (await this.blacklistService.isKeywordBlacklisted(username, BlacklistType.Username)) {
      throw new ApolloError('Username cannot be used', ErrorCode.USERNAME_BLACKLISTED)
    }

    if (await this.usernameService.isPremiumUsername(username, user.id)) {
      throw new ApolloError('Premium username cannot be used', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    const usernameDoc = await this.usernameService.findOneOrCreate(user, username)

    const biolink = this.biolinkRepository.create()
    biolink.username = Promise.resolve(usernameDoc)
    biolink.user = Promise.resolve(user)
    await biolink.save()

    await this.usernameService.linkBiolink(usernameDoc, biolink)

    return biolink
  }
}
