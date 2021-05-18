import { InputType, Field, ObjectType } from 'type-graphql'

import { Link } from '../models/entities/Link'
import { FieldError } from './common.typeDef'

@InputType()
export class NewLinkInput {
  @Field(() => String, { defaultValue: 'Link' })
  linkType!: string

  @Field(() => String)
  url!: string

  @Field(() => String, { nullable: true })
  shortenedUrl?: string

  @Field(() => String, { nullable: true })
  startDate?: Date

  @Field(() => String, { nullable: true })
  endDate?: Date

  @Field(() => String, { defaultValue: 'Disabled' })
  status!: string
}

@ObjectType()
export class LinkResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => [Link], { nullable: true })
  links?: Link[]

  @Field(() => Link, { nullable: true })
  link?: Link
}
