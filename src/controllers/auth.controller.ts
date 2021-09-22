import { ApolloError } from 'apollo-server-errors'
import { Service } from 'typedi'

import { UserWithTokens } from '../object-types'
import { UserService } from '../services/user.service'
import { RegisterInput } from '../input-types'
import { ErrorCode, MyContext } from '../types'
import { BiolinkService } from '../services/biolink.service'
import { UsernameService } from '../services/username.service'
import { TokenService } from '../services/token.service'
import { TrackingService } from '../services/tracking.service'
import { BlackListService } from '../services/blacklist.service'
import { BlacklistType } from '../enums'

@Service()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly biolinkService: BiolinkService,
    private readonly blackListService: BlackListService,
    private readonly usernameService: UsernameService,
    private readonly tokenService: TokenService,
    private readonly trackingService: TrackingService
  ) {}

  async register(registerInput: RegisterInput, context: MyContext): Promise<UserWithTokens> {
    if (await this.usernameService.isUsernameTaken(registerInput.username)) {
      throw new ApolloError('Username is already taken', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    if (
      await this.blackListService.isKeywordBlacklisted(
        registerInput.username,
        BlacklistType.Username
      )
    ) {
      throw new ApolloError('Username cannot be used', ErrorCode.USERNAME_BLACKLISTED)
    }

    if (await this.usernameService.isPremiumUsername(registerInput.username)) {
      throw new ApolloError('Premium username cannot be used', ErrorCode.USERNAME_ALREADY_EXISTS)
    }

    const user = await this.userService.createUser(
      registerInput.email,
      registerInput.password,
      registerInput.referralToken
    )
    await this.biolinkService.createBiolink(user, registerInput.username)

    const { access, refresh } = await this.tokenService.generateAuthTokens(user)

    await this.trackingService.createUserLogs(user, context, 'Created new account', true)

    return {
      access,
      refresh,
      user,
    }
  }
}
