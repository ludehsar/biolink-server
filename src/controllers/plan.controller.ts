import { getRepository } from 'typeorm'

import { Plan } from '../models/entities/Plan'
import { EnabledStatus } from '../models/enums/EnabledStatus'

export const getAllPlans = async (): Promise<Plan[] | null> => {
  const plans = await getRepository(Plan)
    .createQueryBuilder()
    .where({
      visibilityStatus: true,
      enabledStatus: EnabledStatus.Enabled,
    })
    .getMany()

  if (!plans) {
    return null
  }

  return plans
}
