import { getRepository } from 'typeorm'

import { Plan } from '../../models/entities/Plan'
import { EnabledStatus } from '../../models/enums/EnabledStatus'
import { PlanResponse } from '../../typeDefs/plan.typeDef'
import { ErrorCode } from '../../constants/errorCodes'

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
