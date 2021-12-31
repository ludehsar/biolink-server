import { IsBoolean, IsDate, IsEnum, IsOptional, IsUrl, ValidateIf } from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { InputType, Field } from 'type-graphql'
import { LinkType } from '../../enums'

@InputType()
export class LinkAdminInput {
  @Field(() => String, { nullable: true })
  @IsEnum(LinkType)
  linkType?: LinkType

  @Field(() => String, { nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.biolinkId !== '')
  biolinkId?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.userId !== '')
  userId?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUrl()
  @ValidateIf((e) => e.url !== '')
  url?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.linkTitle !== '')
  linkTitle?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.linkColor !== '')
  linkColor?: string

  @Field(() => GraphQLUpload, { nullable: true })
  @IsOptional()
  linkImage?: FileUpload

  @Field(() => String, { nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.note !== '')
  note?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDate()
  @ValidateIf((e) => e.startDate !== '')
  startDate?: Date

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDate()
  @ValidateIf((e) => e.endDate !== '')
  endDate?: Date

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  enablePasswordProtection!: boolean

  @Field(() => String, { nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.password !== '')
  password?: string

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  @IsOptional()
  @IsBoolean()
  featured?: boolean

  @Field(() => String, { nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.platform !== '')
  platform?: string
}
