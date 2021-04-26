import { getRepository } from 'typeorm'

import { Referral } from '../models/entities/Referral'
import { User } from '../models/entities/User'
import { ReferralInput, ReferralResponse } from '../resolvers/referral.resolver'

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

  // TODO: Send mail to all the emails about the referral code

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
