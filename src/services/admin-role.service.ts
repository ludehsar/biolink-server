import { ApolloError } from 'apollo-server-express'
import { Service } from 'typedi'
import { Brackets, Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { InjectRepository } from 'typeorm-typedi-extensions'

import { ErrorCode } from '../types'
import { AdminRole } from '../entities'
import { ConnectionArgs } from '../input-types'
import { PaginatedAdminRoleResponse } from '../object-types/common/PaginatedAdminRoleResponse'
import { AdminRoleUpdateBody } from '../interfaces/AdminRoleUpdateBody'

@Service()
export class AdminRoleService {
  constructor(
    @InjectRepository(AdminRole) private readonly roleRepository: Repository<AdminRole>
  ) {}

  /**
   * Create role
   * @param {AdminRoleUpdateBody} updateBody
   * @returns {Promise<AdminRole>}
   */
  async createAdminRole(updateBody: AdminRoleUpdateBody): Promise<AdminRole> {
    let role = await this.roleRepository.create().save()

    role = await this.updateRoleById(role.id, updateBody)

    return role
  }

  /**
   * Update role by id
   * @param {string} roleId
   * @param {AdminRoleUpdateBody} updateBody
   * @returns {Promise<AdminRole>}
   */
  async updateRoleById(roleId: string, updateBody: AdminRoleUpdateBody): Promise<AdminRole> {
    const role = await this.getRoleById(roleId)

    if (updateBody.roleDescription !== undefined) role.roleDescription = updateBody.roleDescription
    if (updateBody.roleName !== undefined) role.roleName = updateBody.roleName
    if (updateBody.roleSettings !== undefined) role.roleSettings = updateBody.roleSettings

    return role
  }

  /**
   * Delete role by id
   * @param {string} roleId
   * @returns {Promise<AdminRole>}
   */
  async softRemoveRoleById(roleId: string): Promise<AdminRole> {
    const role = await this.getRoleById(roleId)

    await role.softRemove()

    return role
  }

  /**
   * Get all roles
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedAdminRoleResponse>}
   */
  async getAllRoles(options: ConnectionArgs): Promise<PaginatedAdminRoleResponse> {
    const queryBuilder = this.roleRepository.createQueryBuilder('role').andWhere(
      new Brackets((qb) => {
        qb.where(`LOWER(role.roleName) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        }).orWhere(`LOWER(role.roleDescription) like :query`, {
          query: `%${options.query.toLowerCase()}%`,
        })
      })
    )

    const paginator = buildPaginator({
      entity: AdminRole,
      alias: 'role',
      paginationKeys: ['id'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }

  /**
   * Get role by id
   * @param {string} roleId
   * @returns {Promise<AdminRole>}
   */
  async getRoleById(id: string): Promise<AdminRole> {
    const role = await this.roleRepository.findOne(id)

    if (!role) {
      throw new ApolloError('Admin role not found', ErrorCode.ADMIN_ROLE_NOT_FOUND)
    }

    return role
  }
}
