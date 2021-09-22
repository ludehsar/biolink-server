import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { BlackList } from '../entities'

@Service()
export class BlackListService {
  constructor(
    @InjectRepository(BlackList) private readonly blackListRepository: Repository<BlackList>
  ) {}

  /**
   * Checks if a keyword is blacklisted
   * @param {string} keyword
   * @param {string} blacklistType
   * @returns {Promise<BlackList>}
   */
  async isKeywordBlacklisted(keyword: string, blacklistType: string): Promise<boolean> {
    const record = await this.blackListRepository.findOne({
      where: {
        blacklistType,
        keyword,
      },
    })

    return !!record
  }
}
