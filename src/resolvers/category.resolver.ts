import { Arg, ObjectType, Query, Resolver } from 'type-graphql'
import { getAllCateogories } from '../services/category.service'

import { Category } from '../models/entities/Category'
import { ConnectionArgs, ConnectionType, EdgeType } from './relaySpec'

@ObjectType()
export class CategoryEdge extends EdgeType('category', Category) {}

@ObjectType()
export class CategoryConnection extends ConnectionType<CategoryEdge>('category', CategoryEdge) {}

@Resolver()
export class CategoryResolver {
  @Query(() => CategoryConnection, { nullable: true })
  async fetchAllCategories(@Arg('options') options: ConnectionArgs): Promise<CategoryConnection> {
    return await getAllCateogories(options)
  }
}
