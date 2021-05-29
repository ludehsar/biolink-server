import { User, Code } from 'entities'
import { CodeType } from 'enums'
import randToken from 'rand-token'

export const createReferralCode = async (user: User): Promise<Code> => {
  if (!user) {
    return Promise.reject('User not authenticated')
  }

  const code = Code.create({
    code: randToken.generate(10),
    discount: 20,
    quantity: -1,
    type: CodeType.Referral,
  })

  code.referrer = Promise.resolve(user)

  await code.save()

  return code
}
