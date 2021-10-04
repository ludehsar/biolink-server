import { Link } from '../../entities'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class SingleLinkClickCount {
  @Field(() => Link, { nullable: true })
  link?: Link

  @Field(() => Int, { defaultValue: 0 })
  todayVisited?: number

  @Field(() => Int, { defaultValue: 0 })
  allTimeVisited?: number
}
