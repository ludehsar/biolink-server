import { InputType, Field } from 'type-graphql'
import { IsNotEmpty } from 'class-validator'
import { RoleSettings } from '../../json-types'
import { RoleSettingsInput } from '../../input-types'

@InputType()
export class NewAdminRoleInput {
  @Field()
  @IsNotEmpty()
  roleName!: string

  @Field()
  @IsNotEmpty()
  roleDescription!: string

  @Field(() => [RoleSettingsInput], { defaultValue: [] })
  roleSettings!: RoleSettings[]
}
