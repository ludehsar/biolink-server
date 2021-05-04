import randToken from 'rand-token'

import { User } from '../models/entities/User'
import { Code } from '../models/entities/Code'
import { CodeType } from '../models/enums/CodeType'

export const createReferralCode = async (user: User): Promise<Code> => {
  if (!user) {
    return Promise.reject('User not authenticated')
  }

  const code = await Code.create({
    code: randToken.generate(10),
    discount: 20,
    quantity: -1,
    referrer: user,
    type: CodeType.Referral,
  }).save()

  return code
}
