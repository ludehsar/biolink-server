import { Service } from 'typedi'
import { Plan } from '../entities'

import { PlanService } from '../services/plan.service'

@Service()
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  async getAllVisiblePlans(): Promise<Plan[]> {
    return await this.planService.getAllVisiblePlans()
  }
}
