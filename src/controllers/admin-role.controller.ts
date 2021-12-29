import { Service } from 'typedi'

import { ConnectionArgs, NewAdminRoleInput } from '../input-types'
import { AdminRoleService } from '../services/admin-role.service'
import { PaginatedAdminRoleResponse } from '../object-types/common/PaginatedAdminRoleResponse'
import { AdminRole } from '../entities'

@Service()
export class AdminRoleController {
  constructor(private readonly roleService: AdminRoleService) {}

  async getAllRoles(options: ConnectionArgs): Promise<PaginatedAdminRoleResponse> {
    return await this.roleService.getAllRoles(options)
  }

  async getAdminRole(roleId: string): Promise<AdminRole> {
    return await this.roleService.getRoleById(roleId)
  }

  async createAdminRole(input: NewAdminRoleInput): Promise<AdminRole> {
    return await this.roleService.createAdminRole({
      roleDescription: input.roleDescription,
      roleName: input.roleName,
      roleSettings: input.roleSettings,
    })
  }

  async updateAdminRole(roleId: string, input: NewAdminRoleInput): Promise<AdminRole> {
    return await this.roleService.updateRoleById(roleId, {
      roleDescription: input.roleDescription,
      roleName: input.roleName,
      roleSettings: input.roleSettings,
    })
  }

  async deleteAdminRole(roleId: string): Promise<AdminRole> {
    return await this.roleService.softRemoveRoleById(roleId)
  }
}
