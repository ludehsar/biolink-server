import { Category } from 'entities'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class CategoryEdge {
  @Field(() => Category)
  node!: Category

  @Field(() => String, { description: 'Used in `before` and `after` args' })
  cursor!: string
}
