import { Biolink } from '../../entities'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class SingleBiolinkClickCount {
  @Field(() => Biolink, { nullable: true })
  biolink?: Biolink

  @Field(() => Int, { defaultValue: 0 })
  todayVisited?: number

  @Field(() => Int, { defaultValue: 0 })
  allTimeVisited?: number
}
