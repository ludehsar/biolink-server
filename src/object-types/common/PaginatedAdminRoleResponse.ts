import { ObjectType } from 'type-graphql'

import { AdminRole } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedAdminRoleResponse extends PagingResult(AdminRole) {}
