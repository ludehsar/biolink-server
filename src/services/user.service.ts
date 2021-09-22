import { ApolloError } from 'apollo-server-errors'
import * as argon2 from 'argon2'
import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import moment from 'moment'
import axios from 'axios'
import * as geoip from 'geoip-lite'

import { ErrorCode, MyContext } from '../types'
import { User } from '../entities'
import { BlackListService } from './blacklist.service'
import { BlacklistType } from '../enums'
import { CodeService } from './code.service'
import { PlanService } from './plan.service'
import { CountryInfo } from '../interfaces'

@Service()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly blacklistService: BlackListService,
    private readonly codeService: CodeService,
    private readonly planService: PlanService
  ) {}

  /**
   * Create a user
   * @param {string} email
   * @param {string} password
   * @param {string} [referralToken]
   * @returns {Promise<User>}
   */
  async createUser(email: string, password: string, referralToken?: string): Promise<User> {
    if (await this.isEmailTaken(email)) {
      throw new ApolloError('Email is already taken', ErrorCode.EMAIL_ALREADY_EXISTS)
    }

    if (await this.blacklistService.isKeywordBlacklisted(email, BlacklistType.Email)) {
      throw new ApolloError('Email is blacklisted', ErrorCode.EMAIL_BLACKLISTED)
    }

    const encryptedPassword = await argon2.hash(password)
    const user = this.userRepository.create({
      email,
      encryptedPassword,
    })

    if (referralToken) {
      const code = this.codeService.getCodeDoc(referralToken)

      if (code) {
        user.registeredByCode = Promise.resolve(code)
      }
    }

    const freePlan = await this.planService.getFreePlan()
    user.plan = Promise.resolve(freePlan)

    await user.save()

    await this.codeService.createReferralCode(user)

    return user
  }

  /**
   * Is Email Verified
   * @param {string} email
   * @param {string} [excludedId]
   * @returns {Promise<boolean>}
   */
  async isEmailTaken(email: string, excludedId?: string): Promise<boolean> {
    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })

    if (excludedId) {
      qb.andWhere('user.id != :excludedId', { excludedId })
    }

    const user = await qb.getOne()

    return !!user
  }

  /**
   * Get user
   * @param {string} userId
   * @returns {Promise<User>}
   */
  async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId)

    if (!user) {
      throw new ApolloError('Invalid user id', ErrorCode.USER_NOT_FOUND)
    }

    return user
  }

  /**
   * Get user by email
   * @param {string} email
   * @returns {Promise<User>}
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    })

    if (!user) {
      throw new ApolloError('User not found', ErrorCode.USER_NOT_FOUND)
    }

    return user
  }

  /**
   * Updates user metadata such as ip, user agent, and so on
   * @param {User} user
   * @param {MyContext} context
   * @returns {Promise<User>}
   */
  async updateUserMetadata(user: User, context: MyContext): Promise<User> {
    const geo = geoip.lookup(context.req.ip)

    user.language = context.req.acceptsLanguages()[0] || 'Unknown'
    user.lastIPAddress = context.req.ip
    user.lastUserAgent = context.req.headers['user-agent'] || ''
    user.timezone = new Date().getTimezoneOffset().toString()
    user.lastActiveTill = moment(moment.now()).add(5, 'm').toDate()

    if (geo) {
      const countryInfo = await axios.get('https://restcountries.eu/rest/v2/alpha/' + geo.country)

      user.country = (countryInfo.data as CountryInfo).name
      console.log(countryInfo)
    }

    await user.save()
    return user
  }
}
