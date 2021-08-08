import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import {
  createAdminRole,
  deleteAdminRole,
  editAdminRole,
  getAdminRole,
  getAdminRoles,
} from '../../services'
import { AdminRoleListResponse, AdminRoleResponse, DefaultResponse } from '../../object-types'
import { CurrentAdmin } from '../../decorators'
import { User } from '../../entities'
import { NewAdminRoleInput } from '../../input-types'
import { MyContext } from '../../types'

@Resolver()
export class AdminRoleAdminResolver {
  @Query(() => AdminRoleListResponse)
  async getAllAdminRoles(
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<AdminRoleListResponse> {
    return await getAdminRoles(adminUser, context)
  }

  @Query(() => AdminRoleResponse)
  async getAdminRole(
    @Arg('id', () => Int) id: number,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<AdminRoleResponse> {
    return await getAdminRole(id, adminUser, context)
  }

  @Mutation(() => AdminRoleResponse)
  async createAdminRole(
    @Arg('options', () => NewAdminRoleInput) options: NewAdminRoleInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<AdminRoleResponse> {
    return await createAdminRole(options, adminUser, context)
  }

  @Mutation(() => AdminRoleResponse)
  async editAdminRole(
    @Arg('id', () => Int) id: number,
    @Arg('options', () => NewAdminRoleInput) options: NewAdminRoleInput,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<AdminRoleResponse> {
    return await editAdminRole(id, options, adminUser, context)
  }

  @Mutation(() => DefaultResponse)
  async deleteAdminRole(
    @Arg('id', () => Int) id: number,
    @CurrentAdmin() adminUser: User,
    @Ctx() context: MyContext
  ): Promise<DefaultResponse> {
    return await deleteAdminRole(id, adminUser, context)
  }
}
