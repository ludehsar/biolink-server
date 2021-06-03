import { getAdminRoles } from '../../services'
import { Query, Resolver } from 'type-graphql'
import { AdminRoleResponse } from '../../object-types'

@Resolver()
export class AdminRoleAdminResolver {
  @Query(() => AdminRoleResponse)
  async getAllAdminRoles(): Promise<AdminRoleResponse> {
    return await getAdminRoles()
  }
}
