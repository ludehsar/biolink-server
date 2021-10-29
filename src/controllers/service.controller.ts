import { Service } from 'typedi'

import { MyContext } from '../types'
import { Service as ServiceEntity } from '../entities'
import { NewServiceInput } from '../input-types'
import { AccessService } from '../services/access.service'

@Service()
export class ServiceController {
  constructor(private readonly accessService: AccessService) {}

  async createService(input: NewServiceInput, context: MyContext): Promise<ServiceEntity> {
    return await this.accessService.createService({
      description: input.description,
      price: input.price,
      seller: context.user,
      title: input.title,
    })
  }
}
