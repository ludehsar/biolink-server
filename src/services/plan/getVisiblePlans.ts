import { getRepository } from 'typeorm'
import { Plan } from '../../entities'
import { EnabledStatus } from '../../enums'
import { PlanListResponse } from '../../object-types'
import { ErrorCode } from '../../types'

export const getVisiblePlans = async (): Promise<PlanListResponse> => {
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
