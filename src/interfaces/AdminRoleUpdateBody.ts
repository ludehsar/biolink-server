import { RoleSettings } from '../json-types'

export interface AdminRoleUpdateBody {
  roleName?: string
  roleDescription?: string
  roleSettings?: RoleSettings[]
}
