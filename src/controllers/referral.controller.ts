import { MailDataRequired } from '@sendgrid/mail'
import { getRepository } from 'typeorm'

import sgMail from '../utils/sendMail'
import { Referral } from '../models/entities/Referral'
import { User } from '../models/entities/User'
import { ReferralInput, ReferralResponse } from '../resolvers/app/referral.resolver'
import { Code } from '../models/entities/Code'
import { CodeType } from '../models/enums/CodeType'
import { createReferralCode } from './code.controller'
import { FRONTEND_APP_URL } from '../config/app.config'
import { captureUserActivity } from './logs.controller'
import { MyContext } from '../MyContext'

export const getReferralsList = async (user: User): Promise<ReferralResponse> => {
  if (!user) {
    return {
      errors: [
        {
          message: 'User not authenticated',
        },
      ],
    }
  }

  const referrals = await Referral.find({ where: { referredBy: user } })

  return {
    referrals,
  }
}

export const createReferrals = async (
  referralOptions: ReferralInput,
  user: User,
  context: MyContext
): Promise<ReferralResponse> => {
  if (!user) {
    return {
      errors: [
        {
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

  await sgMail.sendMultiple(sendReferralData, (err) => {
    return {
      errors: [
        {
          message: err.message,
        },
      ],
    }
  })

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
          message: 'Something went wrong',
        },
      ],
    }
  }

  // Capture user log
  await captureUserActivity(user, context, 'Sent referrals to other users')

  return await getReferralsList(user)
}
