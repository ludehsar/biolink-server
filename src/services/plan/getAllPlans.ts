import { Plan } from '../../entities'
import { PlanResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const getAllPlans = async (): Promise<PlanResponse> => {
  const plans = await Plan.find()

  if (!plans) {
    return {
      errors: [
        {
          errorCode: ErrorCode.DATABASE_ERROR,
          message: 'Something went wrong',
        },
      ],
    }
  }

  return {
    plans,
  }
}
