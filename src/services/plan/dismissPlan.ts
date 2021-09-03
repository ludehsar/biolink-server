import { getConnection } from 'typeorm'
import { ErrorCode } from '../../types'
import { Plan, User } from '../../entities'
import { DefaultResponse } from '../../object-types'
import { PlanType } from '../../enums'

export const dismissPlan = async (): Promise<DefaultResponse> => {
  const freePlan = await Plan.findOne({ where: { name: 'Free' } })

  if (!freePlan) {
    return {
      errors: [
        {
          errorCode: ErrorCode.DATABASE_ERROR,
          message: 'Free plan not defined',
        },
      ],
    }
  }

  try {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({
        plan: freePlan,
        planExpirationDate: null,
        planType: PlanType.Free,
      })
      .where(`"planExpirationDate" < NOW()`)
      .execute()

    return {}
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
}
