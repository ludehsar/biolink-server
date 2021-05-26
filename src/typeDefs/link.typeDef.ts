import { InputType, Field, ObjectType } from 'type-graphql'

import { Link } from '../models/entities/Link'
import { ErrorResponse } from './common.typeDef'

@InputType()
export class NewLinkInput {
  @Field(() => String, { defaultValue: 'Link' })
  linkType?: string

  @Field(() => String)
  url!: string

  @Field(() => String, { nullable: true })
  linkTitle?: string

  @Field(() => String, { nullable: true })
  note?: string

  @Field(() => String, { nullable: true })
  shortenedUrl?: string

  @Field(() => String, { nullable: true })
  startDate?: Date

  @Field(() => String, { nullable: true })
  endDate?: Date

  @Field(() => String, { defaultValue: 'Disabled' })
  status?: string

  @Field(() => Boolean, { defaultValue: false })
  enablePasswordProtection!: boolean

  @Field(() => String, { nullable: true })
  password?: string
}

@ObjectType()
export class LinkResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => Link, { nullable: true })
  link?: Link
}

@ObjectType()
export class LinkListResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[]

  @Field(() => [Link], { nullable: true })
  links?: Link[]
}
