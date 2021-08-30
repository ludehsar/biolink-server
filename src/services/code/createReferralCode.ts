import randToken from 'rand-token'
import { stripe } from '../../utilities'
import { User, Code } from '../../entities'
import { CodeType } from '../../enums'

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

  await stripe.coupons.create({
    id: code.code,
    percent_off: code.discount,
    duration: 'once',
  })

  code.referrer = Promise.resolve(user)

  await code.save()

  return code
}
