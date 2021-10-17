import { Service } from 'typedi'

import { ConnectionArgs, ReferralInput } from '../input-types'
import { PaginatedReferralResponse } from '../object-types/common/PaginatedReferralResponse'
import { MyContext } from '../types'
import { Referral, User } from '../entities'
import { ReferralService } from '../services/referral.service'
import { CodeService } from '../services/code.service'
import { EmailService } from '../services/email.service'
import { PaginatedUserResponse } from 'object-types/common/PaginatedUserResponse'

@Service()
export class ReferralController {
  constructor(
    private readonly referralService: ReferralService,
    private readonly codeService: CodeService,
    private readonly emailService: EmailService
  ) {}

  async getAllSentEmailReferrals(
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedReferralResponse> {
    return await this.referralService.getAllSentEmailReferrals((context.user as User).id, options)
  }

  async createReferrals(input: ReferralInput, context: MyContext): Promise<Referral[]> {
    const code = await this.codeService.findOrCreateReferralCodeByReferrerId(context.user as User)
    await this.emailService.sendReferralInvitationEmail(
      input.userInfo.map((user) => ({
        email: user.referredToEmail,
        name: user.referredToName,
      })),
      {
        email: input.referredByEmail,
        name: input.referredByName,
      },
      code.code,
      code.discount
    )
    return await this.referralService.createReferralCode(context.user as User, input)
  }

  async getAllUsersRegisteredWithReferralCodes(
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedUserResponse> {
    return await this.referralService.getUsersRegisteredWithReferralCodes(
      (context.user as User).id,
      options
    )
  }
}
