import { Plan } from 'entities'
import { EnabledStatus } from 'enums'
import { PlanResponse } from 'object-types'
import { getRepository } from 'typeorm'
import { ErrorCode } from 'types'

export const getAllPlans = async (): Promise<PlanResponse> => {
  const plans = await getRepository(Plan)
    .createQueryBuilder()
    .where({
      visibilityStatus: true,
      enabledStatus: EnabledStatus.Enabled,
    })
    .getMany()

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
