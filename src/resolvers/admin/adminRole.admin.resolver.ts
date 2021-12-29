import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'

import { AdminRole } from '../../entities'
import { ConnectionArgs, NewAdminRoleInput } from '../../input-types'
import { AdminRoleController } from '../../controllers'
import { PaginatedAdminRoleResponse } from '../../object-types/common/PaginatedAdminRoleResponse'
import { authAdmin } from '../../middlewares/authAdmin'

@Resolver()
export class AdminRoleAdminResolver {
  constructor(private readonly roleController: AdminRoleController) {}

  @Query(() => PaginatedAdminRoleResponse)
  @UseMiddleware(authAdmin('admin_role.canShowList'))
  async getAllAdminRoles(
    @Arg('options') options: ConnectionArgs
  ): Promise<PaginatedAdminRoleResponse> {
    return await this.roleController.getAllRoles(options)
  }

  @Query(() => AdminRole)
  @UseMiddleware(authAdmin('admin_role.canShow'))
  async getAdminRole(@Arg('id', () => String) id: string): Promise<AdminRole> {
    return await this.roleController.getAdminRole(id)
  }

  @Mutation(() => AdminRole)
  @UseMiddleware(authAdmin('admin_role.canCreate'))
  async createAdminRole(
    @Arg('options', () => NewAdminRoleInput) options: NewAdminRoleInput
  ): Promise<AdminRole> {
    return await this.roleController.createAdminRole(options)
  }

  @Mutation(() => AdminRole)
  @UseMiddleware(authAdmin('admin_role.canEdit'))
  async editAdminRole(
    @Arg('id', () => String) id: string,
    @Arg('options', () => NewAdminRoleInput) options: NewAdminRoleInput
  ): Promise<AdminRole> {
    return await this.roleController.updateAdminRole(id, options)
  }

  @Mutation(() => AdminRole)
  @UseMiddleware(authAdmin('admin_role.canDelete'))
  async deleteAdminRole(@Arg('id', () => String) id: string): Promise<AdminRole> {
    return await this.roleController.deleteAdminRole(id)
  }
}
