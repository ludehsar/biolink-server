import { getRepository } from 'typeorm'
import { MailDataRequired } from '@sendgrid/mail'
import { FRONTEND_APP_URL } from '../../config'
import { User, Code, Referral } from '../../entities'
import { CodeType } from '../../enums'
import { ReferralInput } from '../../input-types'
import { ReferralResponse } from '../../object-types'
import { createReferralCode, captureUserActivity, getUserReferrals } from '../../services'
import { MyContext, ErrorCode } from '../../types'
import { sgMail } from '../../utilities'

export const createReferrals = async (
  referralOptions: ReferralInput,
  user: User,
  context: MyContext
): Promise<ReferralResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
    }
  }

  let referralCode = await Code.findOne({ where: { referrer: user, type: CodeType.Referral } })

  if (!referralCode) referralCode = await createReferralCode(user)

  const sendReferralData: MailDataRequired = {
    to: referralOptions.userInfo.map((referredTo) => ({
      name: referredTo.referredToName,
      email: referredTo.referredToEmail,
    })),
    from: {
      name: 'Stashee Support',
      email: 'info@stash.ee',
    },
    subject: `Invitation from ${referralOptions.referredByName} to give you 20% discount on Stashee`,
    text: `Your invitation code is ${FRONTEND_APP_URL}/auth/register?code=${referralCode.code}`,
    cc: {
      email: referralOptions.referredByEmail,
      name: referralOptions.referredByName,
    },
  }

  await sgMail.sendMultiple(sendReferralData)

  try {
    await getRepository(Referral)
      .createQueryBuilder()
      .insert()
      .values(
        referralOptions.userInfo.map((referredTo) => ({
          referredByEmail: referralOptions.referredByEmail,
          referredByName: referralOptions.referredByName,
          referredBy: user,
          referredToEmail: referredTo.referredToEmail,
          referredToName: referredTo.referredToName,
        }))
      )
      .execute()
  } catch (err) {
    return {
      errors: [
        {
          errorCode: ErrorCode.DATABASE_ERROR,
          message: 'Something went wrong',
        },
      ],
    }
  }

  // Capture user log
  await captureUserActivity(user, context, 'Sent referrals to other users')

  return await getUserReferrals(user)
}
