import { Service } from 'typedi'
import { ForbiddenError } from 'apollo-server-errors'

import { MyContext } from '../types'
import { Service as ServiceEntity, User } from '../entities'
import { ConnectionArgs, NewServiceInput } from '../input-types'
import { AccessService } from '../services/access.service'
import { PaginatedServiceResponse } from '../object-types/common/PaginatedServiceResponse'

@Service()
export class ServiceController {
  constructor(private readonly accessService: AccessService) {}

  async getService(serviceId: string): Promise<ServiceEntity> {
    const service = await this.accessService.getServiceById(serviceId)

    return service
  }

  async createService(input: NewServiceInput, context: MyContext): Promise<ServiceEntity> {
    return await this.accessService.createService({
      description: input.description,
      price: input.price,
      seller: context.user,
      title: input.title,
    })
  }

  async editService(
    serviceId: string,
    input: NewServiceInput,
    context: MyContext
  ): Promise<ServiceEntity> {
    const service = await this.accessService.getServiceById(serviceId)

    if (service.sellerId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.accessService.updateServiceById(serviceId, {
      description: input.description,
      price: input.price,
      title: input.title,
    })
  }

  async deleteService(serviceId: string, context: MyContext): Promise<ServiceEntity> {
    const service = await this.accessService.getServiceById(serviceId)

    if (service.sellerId !== (context.user as User).id) {
      throw new ForbiddenError('Forbidden')
    }

    return await this.accessService.softRemoveServiceById(serviceId)
  }

  async getAllUserServices(
    options: ConnectionArgs,
    context: MyContext
  ): Promise<PaginatedServiceResponse> {
    return await this.accessService.getAllServicesByUserId((context.user as User).id, options)
  }

  async getAllServicesByUserId(
    userId: string,
    options: ConnectionArgs
  ): Promise<PaginatedServiceResponse> {
    return await this.accessService.getAllServicesByUserId(userId, options)
  }
}
