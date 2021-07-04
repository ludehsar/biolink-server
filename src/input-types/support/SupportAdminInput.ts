import { IsNotEmpty } from 'class-validator'
import { ResolveStatus } from '../../enums'
import { InputType, Field } from 'type-graphql'

@InputType()
export class SupportAdminInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  status?: ResolveStatus

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  supportReply?: string
}
