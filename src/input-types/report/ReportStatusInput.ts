import { IsNotEmpty } from 'class-validator'
import { ResolveStatus } from '../../enums'
import { InputType, Field } from 'type-graphql'

@InputType()
export class ReportStatusInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  status!: ResolveStatus
}
