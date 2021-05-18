import { ObjectType } from 'type-graphql'

import { Category } from '../models/entities/Category'
import { EdgeType, ConnectionType } from './relaySpec.typeDef'

@ObjectType()
export class CategoryEdge extends EdgeType('category', Category) {}

@ObjectType()
export class CategoryConnection extends ConnectionType<CategoryEdge>('category', CategoryEdge) {}
