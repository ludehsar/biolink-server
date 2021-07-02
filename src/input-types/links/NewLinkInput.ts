import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { IsEnum } from 'class-validator'
import { InputType, Field } from 'type-graphql'
import { LinkType } from '../../enums'

@InputType()
export class NewLinkInput {
  @Field(() => String, { defaultValue: 'Link' })
  @IsEnum(LinkType)
  linkType?: LinkType

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => String, { nullable: true })
  linkTitle?: string

  @Field(() => String, { nullable: true })
  linkColor?: string

  @Field(() => GraphQLUpload, { nullable: true })
  linkImage?: FileUpload

  @Field(() => String, { nullable: true })
  note?: string

  @Field(() => String, { nullable: true })
  startDate?: Date

  @Field(() => String, { nullable: true })
  endDate?: Date

  @Field(() => Boolean, { defaultValue: false })
  enablePasswordProtection!: boolean

  @Field(() => String, { nullable: true })
  password?: string
}
