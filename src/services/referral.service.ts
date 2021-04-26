import { getRepository } from 'typeorm'

import { Referral } from '../models/entities/Referral'
import { User } from '../models/entities/User'
import { ReferralInput, ReferralResponse } from '../resolvers/referral.resolver'
import { Code } from '../models/entities/Code'
import { CodeType } from '../models/enums/CodeType'
import { createReferralCode } from './code.service'
import sendMailQueue from '../queues/sendMailQueue'

export const getReferralsList = async (user: User): Promise<ReferralResponse> => {
  if (!user) {
    return {
      errors: [
        {
          field: '',
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
  user: User
): Promise<ReferralResponse> => {
  if (!user) {
    return {
      errors: [
        {
          field: '',
          message: 'User not authenticated',
        },
      ],
    }
  }

  let referralCode = await Code.findOne({ where: { referrer: user, type: CodeType.Referral } })

  if (!referralCode) referralCode = await createReferralCode(user)
  const emailVerificationData = {
    to: referralOptions.userInfo.map((referredTo) => ({
      address: referredTo.referredToEmail,
      name: referredTo.referredToName,
    })),
    subject: `Invitation from ${referralOptions.referredByName} to give you 20% discount on Linkby`,
    body: `Your invitation code is ${referralCode.code}.`,
    ccName: referralOptions.referredByName,
    ccEmail: referralOptions.referredByEmail,
  }
  await sendMailQueue.add(emailVerificationData)

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
          field: '',
          message: 'Something went wrong',
        },
      ],
    }
  }

  return await getReferralsList(user)
}
